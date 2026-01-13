import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = ['/', '/login', '/login/admin', '/login/client', '/register']

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN']
const CLIENT_ROLES = ['CLIENT_SUPER_ADMIN', 'CLIENT_ADMIN', 'CLIENT_USER']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const role = request.cookies.get('user-role')?.value
  const { pathname } = request.nextUrl

  const isLoginPage = pathname === '/login' || pathname.startsWith('/login/')
  const isAdminRoute = pathname.startsWith('/admin')
  const isClientRoute = pathname.startsWith('/client')


  // ============================================
// 0. Root route redirect for logged-in users
// ============================================
if (pathname === '/' && token) {
  if (ADMIN_ROLES.includes(role ?? '')) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  if (CLIENT_ROLES.includes(role ?? '')) {
    return NextResponse.redirect(new URL('/client/dashboard', request.url))
  }

  return NextResponse.redirect(new URL('/login', request.url))
}


  // ============================================
  // 1. Logged-in users visiting login pages
  // ============================================
  if (token && isLoginPage) {
    if (ADMIN_ROLES.includes(role ?? '')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    if (CLIENT_ROLES.includes(role ?? '')) {
      return NextResponse.redirect(new URL('/client/dashboard', request.url))
    }

    // Unknown role → force logout
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ============================================
  // 2. Public routes
  // ============================================
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // ============================================
  // 3. Admin routes (STRICT)
  // ============================================
  if (isAdminRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login/admin', request.url))
    }

    if (!ADMIN_ROLES.includes(role ?? '')) {
      return NextResponse.redirect(new URL('/client/dashboard', request.url))
    }

    return NextResponse.next()
  }

  // ============================================
  // 4. Client routes (STRICT)
  // ============================================
  if (isClientRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login/client', request.url))
    }

    if (!CLIENT_ROLES.includes(role ?? '')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    return NextResponse.next()
  }

  // ============================================
  // 5. Fallback protection
  // ============================================
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
