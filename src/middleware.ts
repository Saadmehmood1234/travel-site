
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // Simplified token retrieval - no need for cookie name
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Authentication check
  if (!token) {
    return NextResponse.redirect(new URL("/signin", nextUrl));
  }

  // Role-based authorization
  if (nextUrl.pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
