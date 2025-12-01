import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.log('[activate-plan] Request received')
  
  const cookieStore = await cookies()

  // 1. Criar cliente Supabase no servidor
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options)
            } catch {
              // Ignore errors in Route Handlers
            }
          })
        },
      },
    }
  )

  // 2. Verificar Sessão (CRITICAL - SEGURANÇA)
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) {
    console.error('[activate-plan] Auth error:', authError)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
  if (!user) {
    console.error('[activate-plan] No user found in session')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  console.log('[activate-plan] User authenticated:', user.id)

  // 3. Ler dados do corpo da requisição
  let tier: string
  try {
    const body = await request.json()
    if (typeof body.tier !== 'string') {
      return NextResponse.json({ error: 'Invalid tier: must be a string' }, { status: 400 })
    }
    tier = body.tier
  } catch (e) {
    console.error('[activate-plan] Failed to parse request body:', e)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  // Validar tier (CRITICAL - SEGURANÇA)
  const validTiers = ['monthly', 'quarterly', 'annual']
  if (!validTiers.includes(tier)) {
    return NextResponse.json(
      { error: `Invalid tier. Must be one of: ${validTiers.join(', ')}` },
      { status: 400 }
    )
  }
  console.log('[activate-plan] Tier validated:', tier)

  // 4. Verificar se perfil existe
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  // 5. Se perfil não existir, criar com plano ativo (fallback para trigger falhado)
  if (!profile) {
    console.log('[activate-plan] Profile not found, creating new profile')
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        has_active_plan: true,
        plan_tier: tier,
        updated_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error('[activate-plan] Failed to create profile:', insertError)
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
    }

    console.log('[activate-plan] Profile created successfully with plan:', tier)
    return NextResponse.json({ success: true })
  }

  // 6. Atualizar Perfil existente com .select() para verificar se afetou alguma linha
  const { data, error } = await supabase
    .from('profiles')
    .update({
      has_active_plan: true,
      plan_tier: tier,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()

  if (error) {
    console.error('[activate-plan] Database error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }

  // Verificar se o update realmente afetou alguma linha
  if (!data || data.length === 0) {
    console.error('[activate-plan] Update did not affect any rows')
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  console.log('[activate-plan] Update success:', data[0])
  return NextResponse.json({ success: true, data: data[0] })
}
