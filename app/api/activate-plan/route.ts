import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tier, userId } = body

    console.log('[activate-plan] Request received:', { tier, userId })

    if (!tier || !userId) {
      console.log('[activate-plan] Missing fields:', { tier, userId })
      return NextResponse.json(
        { error: 'Missing required fields: tier and userId' },
        { status: 400 }
      )
    }

    // Validate tier value
    const validTiers = ['monthly', 'quarterly', 'annual']
    if (!validTiers.includes(tier)) {
      console.log('[activate-plan] Invalid tier:', tier)
      return NextResponse.json(
        { error: `Invalid tier. Must be one of: ${validTiers.join(', ')}` },
        { status: 400 }
      )
    }

    // Create Supabase server client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            } catch {
              // setAll is called from Server Component. Ignore errors in Route Handlers.
            }
          },
        },
      }
    )

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    console.log('[activate-plan] Auth check:', { 
      hasUser: !!user, 
      userId: user?.id,
      authError: authError?.message 
    })

    if (authError || !user) {
      console.log('[activate-plan] Auth failed:', authError)
      return NextResponse.json(
        { error: 'Unauthorized: User not authenticated' },
        { status: 401 }
      )
    }

    // Verify the userId matches the authenticated user (security check)
    if (user.id !== userId) {
      console.log('[activate-plan] User ID mismatch:', { requestedId: userId, actualId: user.id })
      return NextResponse.json(
        { error: 'Forbidden: User ID mismatch' },
        { status: 403 }
      )
    }

    // TODO: In production, verify payment here before activating the plan
    // For now, we'll activate the plan directly (demo/development mode)

    console.log('[activate-plan] Updating profile for user:', userId)

    // Update the user's profile with the plan
    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({
        has_active_plan: true,
        plan_tier: tier,
      })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('[activate-plan] Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to activate plan. Please try again.', details: updateError.message },
        { status: 500 }
      )
    }

    console.log('[activate-plan] Success! Updated profile:', data)

    return NextResponse.json({
      success: true,
      message: 'Plan activated successfully',
      profile: data,
    })
  } catch (error) {
    console.error('[activate-plan] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
