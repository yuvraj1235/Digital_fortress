import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/home",
  "/leaderboard",
  "/profile", // Added profile to protected list
  "/house",
  "/house2",
  "/ruins",
  "/leaderboard",
  "/village",
  "/arena",

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
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Prevent logged-in users from going to /login or the root /
  if ((pathname === "/login" || pathname === "/") && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

// Ensure the matcher covers the profile path
export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/leaderboard/:path*",
    "/profile/:path*", // Added profile to matcher
    "/login",
  ],
};