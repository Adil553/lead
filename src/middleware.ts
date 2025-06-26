import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { USER_ROLE } from "./constants/constants";

// const publicRoutes = ["/", "/forgot-password"];

// const authRoutes = [
//   "/auth/signin",
//   "/auth/signup",
//   "/auth/verify",
//   "/auth/forgot",
// ];

export function middleware() {
  //   const { pathname } = request.nextUrl;
  //   const userCookie = request.cookies.get("user");

  //   const isAuthRoute = authRoutes.includes(pathname);
  //   const isPublicRoute = publicRoutes.includes(pathname);
  //   const isExplicitlyRestricted = pathname.startsWith("/orders");

  //   const isDynamicPublicRoute =
  //     /^\/[^\/]+(\/[^\/]+)?$/.test(pathname) &&
  //     !pathname.startsWith("/auth") &&
  //     !isExplicitlyRestricted;

  //   if (!userCookie) {
  //     // User is not logged in
  //     if (!isAuthRoute && !isPublicRoute && !isDynamicPublicRoute) {
  //       return NextResponse.redirect(new URL("/auth/signin", request.url));
  //     }
  //     return NextResponse.next();
  //   }

  //   const user = JSON.parse(userCookie.value || "{}");

  //   // Redirect authenticated users away from auth routes
  //   if (isAuthRoute) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }

  //   // ✅ If user is not a USER and trying to access "/", redirect to store page
  //   if (pathname === "/" && user?.roleId !== USER_ROLE.USER && user?.storeId) {
  //     const encodedStoreId = btoa(user.storeId.toString());
  //     return NextResponse.redirect(new URL(`/${encodedStoreId}`, request.url));
  //   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
