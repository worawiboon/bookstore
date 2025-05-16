import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const protectedPaths = [ '/profile'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value;

  // 1. ตรวจสอบเส้นทางที่ต้องล็อกอิน
  const isProtectedPath = protectedPaths.some((p) => path.startsWith(p));

  // 2. หากเป็นเส้นทางที่ต้องล็อกอิน แต่ไม่มี Token => Redirect ไป Login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (request.nextUrl.pathname.startsWith('/api/books/')) {
    if (!token) {
      return NextResponse.json(
        { error: "กรุณาล็อกอินก่อนใช้งาน" },
        { status: 401 }
      );
    }
  }

  // 3. หากมี Token แต่ตรวจสอบไม่ผ่าน => ลบ Token และ Redirect
  if (isProtectedPath && token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // 4. อนุญาตให้เข้าถึงหน้า Login/Register ได้หากไม่ได้ล็อกอิน
  if ((path === '/login' || path === '/register') && token) {
    return NextResponse.redirect(new URL('/books', request.url));
  }

  return NextResponse.next();

  
}