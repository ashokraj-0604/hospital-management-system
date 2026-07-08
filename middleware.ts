// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';

// Route prefix -> roles allowed to enter it. Keep this the single source
// of truth for "who can open which dashboard" on the frontend; the real
// security boundary is still the backend's @Roles()/RolesGuard.
const ROUTE_ROLES: Record<string, string[]> = {
  '/super-admin': ['SUPER_ADMIN'],
  '/hospital-admin': ['HOSPITAL_ADMIN'],
  '/doctor': ['DOCTOR'],
  '/reception': ['RECEPTIONIST'],
  '/nurse': ['NURSE'],
  '/pharmacy': ['PHARMACIST'],
  '/laboratory': ['LAB_TECHNICIAN', 'DOCTOR'],
  '/billing': ['BILLING_OFFICER', 'HOSPITAL_ADMIN'],
  '/inventory': ['INVENTORY_MANAGER', 'HOSPITAL_ADMIN'],
};

// Where each role lands after login / after a blocked redirect.
const HOME_BY_ROLE: Record<string, string> = {
  SUPER_ADMIN: '/super-admin',
  HOSPITAL_ADMIN: '/hospital-admin',
  DOCTOR: '/doctor',
  RECEPTIONIST: '/reception',
  NURSE: '/nurse',
  PHARMACIST: '/pharmacy',
  LAB_TECHNICIAN: '/laboratory',
  BILLING_OFFICER: '/billing',
  INVENTORY_MANAGER: '/inventory',
};

function matchedPrefix(pathname: string): string | null {
  return (
    Object.keys(ROUTE_ROLES).find(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    ) ?? null
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const prefix = matchedPrefix(pathname);

  // Not a role-guarded route (e.g. /login, /forgot-password, static assets)
  if (!prefix) {
    return NextResponse.next();
  }

  const role = request.cookies.get('hms_user_role')?.value;

  // No session at all — bounce to login
  if (!role) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowedRoles = ROUTE_ROLES[prefix];

  // Logged in, but wrong role for this route group — send them to their
  // own dashboard rather than a bare 403, since they do have a valid session.
  if (!allowedRoles.includes(role)) {
    const home = HOME_BY_ROLE[role] ?? '/login';
    return NextResponse.redirect(new URL(home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/super-admin/:path*',
    '/hospital-admin/:path*',
    '/doctor/:path*',
    '/reception/:path*',
    '/nurse/:path*',
    '/pharmacy/:path*',
    '/laboratory/:path*',
    '/billing/:path*',
    '/inventory/:path*',
  ],
};
