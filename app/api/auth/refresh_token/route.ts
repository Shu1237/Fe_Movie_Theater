import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { access_token } = body;
   
  if (!access_token) {
    return NextResponse.json(
      { message: "Thiếu token để làm mới session" },
      { status: 400 }
    );
  }
  // set token mới vào cookie response
  const response = NextResponse.json({
    message: "Refresh token thành công",
  });

  response.cookies.set("access_token", access_token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 4 * 60 * 60,
  });
  return response;
}
