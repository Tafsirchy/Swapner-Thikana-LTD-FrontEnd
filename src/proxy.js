import { NextResponse } from 'next/server';

/**
 * Next.js Proxy - Server-side route protection
 * Updated for Next.js 16 (proxy.js convention)
 * Runs BEFORE any page renders, preventing unauthorized access to sensitive areas.
 */
export default function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token');

  // List of routes that require authentication
  const protectedPaths = ['/dashboard', '/profile', '/saved'];
  const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedRoute) {
    if (!token || token.value === 'none') {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Protect dashboard, profile, and saved routes at the Edge
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/saved/:path*'
  ],
};
