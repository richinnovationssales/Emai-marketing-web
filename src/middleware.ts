import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register', '/'];
const adminRoutes = ['/admin'];
const clientRoutes = ['/client'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
        return NextResponse.next();
    }

    // Redirect to login if no token
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // TODO: Decode JWT and verify role-based access
    // For admin routes, check for ADMIN or SUPER_ADMIN role
    // For client routes, check for CLIENT_* roles

    // For now, allow all authenticated users
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
