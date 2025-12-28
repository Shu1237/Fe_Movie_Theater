import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    
    // Xóa cookie access_token
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Đăng xuất thành công" 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        message: "Lỗi khi đăng xuất" 
      },
      { status: 500 }
    );
  }
}