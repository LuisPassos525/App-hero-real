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
    // Include total_points as a fallback check for quiz completion
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('total_points, onboarding_completed, has_active_plan')
      .eq('id', user.id)
      .single()

    // If there's an error fetching the profile (other than not found), 
    // allow access but treat as no quiz done
    if (profileError && profileError.code !== PROFILE_NOT_FOUND_ERROR) {
      console.error('Error fetching profile:', profileError)
    }

    // Determine user state based on schema fields
    // Profile might not exist for new users - treat as no quiz done
    // Check both onboarding_completed flag AND total_points > 0 as fallback
    const hasCompletedQuiz = profile?.onboarding_completed === true || 
      (profile?.total_points ?? 0) > 0
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

    // For protected routes, enforce the state machine
    if (!isPublic) {
      // State Machine Logic:
      // 1. No quiz completed (onboarding_completed=false AND total_points=0) -> can only access /quiz
      // 2. Quiz done but no plan -> can access /quiz (already done) and /plans
      // 3. Quiz done + plan active -> can access everything

      if (!hasCompletedQuiz) {
        // User hasn't completed quiz - only allow /quiz
        if (pathname !== '/quiz') {
          return NextResponse.redirect(new URL('/quiz', request.url))
        }
      } else if (!hasActivePlan) {
        // User completed quiz but no active plan - allow /quiz and /plans only
        if (pathname !== '/quiz' && pathname !== '/plans') {
          return NextResponse.redirect(new URL('/plans', request.url))
        }
      }
      // If hasCompletedQuiz && hasActivePlan, allow access to any protected route
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}