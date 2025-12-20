import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register', '/'];
const adminRoutes = ['/admin'];
const clientRoutes = ['/client'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const { pathname } = request.nextUrl;

    const isLoginPage = pathname === '/login' || pathname.startsWith('/login/');
    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    if (publicRoutes.some((route) => pathname === route) || isLoginPage || pathname === '/register') {
        return NextResponse.next();
    }

    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
