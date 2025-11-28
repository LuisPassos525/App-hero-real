import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
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

  // 2. Verificar Sessão
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) {
    console.error('[activate-plan] Auth error:', authError)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
  }
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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

  // Validar tier
  const validTiers = ['monthly', 'quarterly', 'annual']
  if (!validTiers.includes(tier)) {
    return NextResponse.json(
      { error: `Invalid tier. Must be one of: ${validTiers.join(', ')}` },
      { status: 400 }
    )
  }

  // 4. Atualizar Perfil com .select() para verificar se o update afetou alguma linha
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Verificar se o update realmente afetou alguma linha
  if (!data || data.length === 0) {
    console.error('[activate-plan] No profile found for user:', user.id)
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
