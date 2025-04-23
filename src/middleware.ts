import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Handle admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to login page
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Check admin session for all other admin routes
    const adminCookie = request.cookies.get('adminAuthenticated');
    if (!adminCookie || adminCookie.value !== 'true') {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Handle user routes that require authentication
  const protectedUserRoutes = ['/cart', '/checkout', '/profile'];
  if (protectedUserRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    const userCookie = request.cookies.get('user_session');
    if (!userCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/profile/:path*"
  ],
}; 