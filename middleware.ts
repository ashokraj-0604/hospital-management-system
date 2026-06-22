import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_TOKEN_KEY, ROUTES } from './src/constants/app.constants';

const roleDestinations: Record<string, string> = {
  SUPER_ADMIN: '/super-admin',
  HOSPITAL_ADMIN: ROUTES.HOSPITAL_ADMIN,
};

const getRoleDestination = (role?: string) => roleDestinations[role ?? ''] ?? ROUTES.DASHBOARD;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;
  const role = request.cookies.get('hms_user_role')?.value;

  // Redirect unauthenticated users to login
  if (
    !token &&
    (pathname.startsWith('/super-admin') ||
      pathname.startsWith('/hospital-admin') ||
      pathname.startsWith('/dashboard'))
  ) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
  }

  // Redirect authenticated users away from login
  if (token && pathname === ROUTES.LOGIN) {
    return NextResponse.redirect(new URL(getRoleDestination(role), request.url));
  }

  if (token && pathname.startsWith('/super-admin') && role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL(getRoleDestination(role), request.url));
  }

  if (token && pathname.startsWith('/hospital-admin') && role !== 'HOSPITAL_ADMIN') {
    return NextResponse.redirect(new URL(getRoleDestination(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/super-admin/:path*', '/hospital-admin/:path*', '/dashboard/:path*', '/'],
};

