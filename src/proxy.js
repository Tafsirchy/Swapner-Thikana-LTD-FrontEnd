import { NextResponse } from 'next/server';

/**
 * Fix 2: Next.js Edge Proxy — server-side route protection (Next.js 16+)
 * Renamed from middleware.js → proxy.js per Next.js 16 convention.
 * Runs BEFORE any page renders, eliminating the flash of protected content.
 * Checks for the presence of the 'token' cookie and redirects unauthenticated
 * users to the login page with a ?redirect= param so they return after login.
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token');

  // Protect all /dashboard routes at the Edge
  if (pathname.startsWith('/dashboard')) {
    if (!token || token.value === 'none') {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only run on dashboard routes — skip static assets and API
  matcher: ['/dashboard/:path*'],
};
