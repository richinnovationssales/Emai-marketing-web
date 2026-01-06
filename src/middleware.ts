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


// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const publicRoutes = ['/', '/login', '/login/admin', '/login/client', '/register'];
// const adminRoutes = ['/admin'];
// const clientRoutes = ['/client'];

// export function middleware(request: NextRequest) {
//     const token = request.cookies.get('auth-token')?.value;
//     const userRole = request.cookies.get('user-role')?.value; // Store role in separate cookie
//     // Alternative: Decode role from JWT token if you prefer
//     const { pathname } = request.nextUrl;

//     // Check route types
//     const isPublicRoute = publicRoutes.includes(pathname);
//     const isLoginPage = pathname === '/login' || pathname.startsWith('/login/');
//     const isAdminRoute = pathname.startsWith('/admin');
//     const isClientRoute = pathname.startsWith('/client');

//     // ============================================
//     // 1. Handle authenticated users on login pages
//     // ============================================
//     if (token && isLoginPage) {
//         // Redirect based on user role
//         if (userRole === 'super-admin' || userRole === 'admin') {
//             return NextResponse.redirect(new URL('/admin/dashboard', request.url));
//         } else if (userRole === 'client' || userRole === 'client-admin' || userRole === 'client-employee') {
//             return NextResponse.redirect(new URL('/client/dashboard', request.url));
//         }
//         // Fallback if role is not set
//         return NextResponse.redirect(new URL('/admin/dashboard', request.url));
//     }

//     // ============================================
//     // 2. Allow access to public routes
//     // ============================================
//     if (isPublicRoute) {
//         return NextResponse.next();
//     }

//     // ============================================
//     // 3. Protect admin routes
//     // ============================================
//     if (isAdminRoute) {
//         // No token - redirect to admin login
//         if (!token) {
//             const loginUrl = new URL('/login/admin', request.url);
//             loginUrl.searchParams.set('redirect', pathname);
//             return NextResponse.redirect(loginUrl);
//         }

//         // Has token but wrong role - redirect to appropriate dashboard
//         if (userRole === 'client' || userRole === 'client-admin' || userRole === 'client-employee') {
//             return NextResponse.redirect(new URL('/client/dashboard', request.url));
//         }

//         // Admin/super-admin can proceed
//         return NextResponse.next();
//     }

//     // ============================================
//     // 4. Protect client routes
//     // ============================================
//     if (isClientRoute) {
//         // No token - redirect to client login
//         if (!token) {
//             const loginUrl = new URL('/login/client', request.url);
//             loginUrl.searchParams.set('redirect', pathname);
//             return NextResponse.redirect(loginUrl);
//         }

//         // Has token but wrong role - redirect to appropriate dashboard
//         if (userRole === 'admin' || userRole === 'super-admin') {
//             return NextResponse.redirect(new URL('/admin/dashboard', request.url));
//         }

//         // Client users can proceed
//         return NextResponse.next();
//     }

//     // ============================================
//     // 5. Handle any other protected routes
//     // ============================================
//     if (!token) {
//         const loginUrl = new URL('/login', request.url);
//         loginUrl.searchParams.set('redirect', pathname);
//         return NextResponse.redirect(loginUrl);
//     }

//     return NextResponse.next();
// }

// export const config = {
//     matcher: [
//         /*
//          * Match all request paths except:
//          * - api routes
//          * - _next/static (static files)
//          * - _next/image (image optimization files)
//          * - favicon.ico
//          * - public files with extensions (images, etc.)
//          */
//         '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
//     ],
// };
