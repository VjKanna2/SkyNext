import { NextResponse } from 'next/server';
import { TOKEN } from './lib/auth/TokenAuth';

export function middleware(request) {
    const token = request.cookies.get(TOKEN)?.value;

    const { pathname } = request.nextUrl;

    if ((!token && pathname.startsWith('/profile') || (token && pathname === '/login'))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/login', '/profile/:path*'],
};
