import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Danh sách các route cần bảo vệ
const privatePaths = ['/dashboard']
const authPaths = ['/login']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get('access_token')?.value

  // 1. Nếu vào trang private mà chưa đăng nhập -> Về trang Login
  if (privatePaths.some(path => pathname.startsWith(path)) && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

//   // 2. Nếu đã đăng nhập mà cố vào lại trang Login -> Về trang Dashboard
//   if (authPaths.some(path => pathname.startsWith(path)) && accessToken) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }

  return NextResponse.next()
}

// Cấu hình matcher để middleware chỉ chạy qua những trang cần thiết
export const config = {
  matcher: ['/dashboard', '/login', '/register'],
}