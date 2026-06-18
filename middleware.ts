import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('hms_access_token')?.value;

  // Redirect unauthenticated users to login
  if (!token && pathname.startsWith('/super-admin')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from login
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/super-admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/super-admin/:path*', '/dashboard/:path*', '/login'],
};

