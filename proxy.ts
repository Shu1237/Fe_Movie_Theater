import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Danh sách các route cần bảo vệ
const privatePaths = ["/dashboard", "/register"];
const authPaths = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  
  if (privatePaths.some((path) => pathname.startsWith(path))) {
    if (!refreshToken) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      return response;
    }
  }
 


  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/login", "/register"],
};
