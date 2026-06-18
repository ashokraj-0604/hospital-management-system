import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '@/src/constants/routes';

const PROTECTED_ROUTES = [
  ROUTES.admin.dashboard,
  ROUTES.admin.appointments,
  ROUTES.doctor.patients,
  ROUTES.patient.medicalRecords,
] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('hms_access_token')?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/appointments/:path*', '/patients/:path*', '/medical-records/:path*', '/login'],
};
