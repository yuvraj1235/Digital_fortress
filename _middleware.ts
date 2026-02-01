import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mapping routes to the required round level
const LEVEL_REQUIREMENTS: Record<string, number> = {
  "/house": 1,
  "/house2": 2,
  "/ruins": 3,
  "/village": 4,
  "/arena": 5,
  "/mountain": 6,
};

// ✅ ADDED "/quiz" to this list
const PROTECTED_ROUTES = [
  "/home", 
  "/leaderboard", 
  "/profile", 
  "/quiz", 
  ...Object.keys(LEVEL_REQUIREMENTS)
];

const PUBLIC_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("df_token")?.value;
  const userRound = parseInt(request.cookies.get("df_round")?.value || "1", 10);
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isPublic = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // 1. Auth Guard: No token -> Login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Auth Guard: Logged in -> Don't show Login/Register
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // 3. Level Guard: Specific sector protection
  for (const [route, requiredLevel] of Object.entries(LEVEL_REQUIREMENTS)) {
    if (pathname.startsWith(route)) {
      if (userRound < requiredLevel) {
        console.warn(`🚫 Access Denied: Need Level ${requiredLevel}, Have Level ${userRound}`);
        return NextResponse.redirect(new URL("/home", request.url));
      }
    }
  }

  // 4. Root redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL(token ? "/home" : "/login", request.url));
  }

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
    "/mountain/:path*",
    "/quiz/:path*", // ✅ Already here, now the logic supports it
    "/login",
    "/register",
  ],
};