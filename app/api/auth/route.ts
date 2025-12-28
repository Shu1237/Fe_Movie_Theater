import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { access_token, refresh_token } = body;

  if (!access_token || !refresh_token) {
    return NextResponse.json(
      { message: 'Thiếu token để thiết lập session' }, 
      { status: 400 }
    );
  }

  const response = NextResponse.json({ 
    message: 'Đã thiết lập session thành công' 
  });


  response.cookies.set('access_token', access_token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 4 * 60 * 60, 
  });


  response.cookies.set('refresh_token', refresh_token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 2 * 24 * 60 * 60,
  });

  return response;
}