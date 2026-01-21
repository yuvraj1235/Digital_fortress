import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/home",
  "/leaderboard",
  "/profile",
];

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get("df_token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Check if the current route is in the protected list
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // 2. If protected and no token, redirect to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    // Optional: add the current path to redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Prevent logged-in users from going to the login page again
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

// Ensure the matcher covers all relevant paths
export const config = {
  matcher: [
    "/home/:path*",
    "/leaderboard/:path*",
    "/profile/:path*",
    "/login",
  ],
};