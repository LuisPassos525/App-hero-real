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
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 3. Ler dados do corpo da requisição
  const { tier } = await request.json()

  // Validar tier
  const validTiers = ['monthly', 'quarterly', 'annual']
  if (!tier || !validTiers.includes(tier)) {
    return NextResponse.json(
      { error: `Invalid tier. Must be one of: ${validTiers.join(', ')}` },
      { status: 400 }
    )
  }

  // 4. Atualizar Perfil
  const { error } = await supabase
    .from('profiles')
    .update({
      has_active_plan: true,
      plan_tier: tier,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('Erro ao ativar plano:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
