import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || "fallback-secret-for-development-only"
);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    const { pathname } = request.nextUrl;

    // Logic to protect dashboard routes
    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Logic to redirect from login/register if already logged in
    if (pathname === '/login' || pathname === '/register') {
        if (token) {
            try {
                await jwtVerify(token, secret);
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } catch (error) {
                return NextResponse.next();
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
};
