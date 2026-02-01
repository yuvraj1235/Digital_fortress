import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/home",
  "/leaderboard",
  "/profile",
  "/house",
  "/house2",
  "/ruins",
  "/village",
  "/arena",
];

const PUBLIC_ROUTES = [
  "/login",
  "/register",
];

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get("df_token")?.value;
  const { pathname } = request.nextUrl;

  console.log("🔒 Middleware check:", { pathname, hasToken: !!token });

  // 1. Check if the current route is protected
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // 2. Check if the current route is public (login/register)
  const isPublic = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // 3. If protected route and no token, redirect to login
  if (isProtected && !token) {
    console.log("❌ No token, redirecting to login");
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. If user has token and tries to access login/register, redirect to home
  if (isPublic && token) {
    console.log("✅ Has token, redirecting to home");
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // 5. If user has token and is on root ("/"), redirect to home
  if (pathname === "/" && token) {
    console.log("✅ Has token on root, redirecting to home");
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // 6. If user has no token and is on root ("/"), redirect to login
  if (pathname === "/" && !token) {
    console.log("❌ No token on root, redirecting to login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/leaderboard/:path*",
    "/profile/:path*",
    "/house/:path*",
    "/house2/:path*",
    "/ruins/:path*",
    "/village/:path*",
    "/arena/:path*",
    "/login",
    "/register",
  ],
};