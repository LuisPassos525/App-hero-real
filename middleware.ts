import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password', '/auth/callback']

// Supabase error code for "row not found" in single() query
const PROFILE_NOT_FOUND_ERROR = 'PGRST116'

// Helper function to check if a route is public
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route) || pathname.startsWith('/auth/')
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname

  // Check if route is public using helper function
  const isPublic = isPublicRoute(pathname)

  // Use getUser() instead of getSession() for reliable server-side auth
  const { data: { user } } = await supabase.auth.getUser()

  // If no session and trying to access protected route, redirect to login
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is logged in
  if (user) {
    // Query the user's profile once for all subsequent checks
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_completed, has_active_plan')
      .eq('id', user.id)
      .single()

    // If there's an error fetching the profile (other than not found), 
    // allow access but treat as no quiz done
    if (profileError && profileError.code !== PROFILE_NOT_FOUND_ERROR) {
      console.error('Error fetching profile:', profileError)
    }

    // Determine user state based on schema fields
    // Profile might not exist for new users - treat as no quiz done
    const hasCompletedQuiz = profile?.onboarding_completed === true
    const hasActivePlan = profile?.has_active_plan === true

    // Redirect authenticated users away from login/register
    if (['/login', '/register'].includes(pathname)) {
      if (!hasCompletedQuiz) {
        return NextResponse.redirect(new URL('/quiz', request.url))
      } else if (!hasActivePlan) {
        return NextResponse.redirect(new URL('/plans', request.url))
      } else {
        return NextResponse.redirect(new URL('/homepage', request.url))
      }
    }

    // For protected routes, enforce the STATE MACHINE with reverse blocking
    if (!isPublic) {
      // ==========================================
      // STATE MACHINE - 3 States with Reverse Blocking
      // ==========================================
      
      // STATE 1: New User (onboarding_completed = false)
      // - Allowed: /quiz only
      // - Blocked: /plans, /homepage → redirect to /quiz
      if (!hasCompletedQuiz) {
        if (pathname !== '/quiz') {
          return NextResponse.redirect(new URL('/quiz', request.url))
        }
      }
      
      // STATE 2: Quiz Done, No Plan (onboarding_completed = true, has_active_plan = false)
      // - Allowed: /plans only
      // - Blocked: /quiz (can't go back), /homepage → redirect to /plans
      else if (!hasActivePlan) {
        if (pathname !== '/plans') {
          return NextResponse.redirect(new URL('/plans', request.url))
        }
      }
      
      // STATE 3: Active Member (onboarding_completed = true, has_active_plan = true)
      // - Allowed: /homepage, /dashboard, etc.
      // - Blocked: /quiz, /plans (can't go back) → redirect to /homepage
      else {
        if (pathname === '/quiz' || pathname === '/plans') {
          return NextResponse.redirect(new URL('/homepage', request.url))
        }
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}