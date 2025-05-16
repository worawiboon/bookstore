import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // สร้าง Response และลบ Cookie
    const response = NextResponse.json(
      { message: "ออกจากระบบสำเร็จ" },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: '',
      expires: new Date(0), // ตั้งค่าให้หมดอายุทันที
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการออกจากระบบ" },
      { status: 500 }
    );
  }
}