import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    // ตรวจสอบ Header และ Parse JSON
    const contentType = req.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: "Content-Type ต้องเป็น application/json" },
        { status: 400 }
      );
    }

    // ตรวจสอบและ Parse Request Body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "รูปแบบ JSON ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const { username, password } = body;

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!username || !password) {
      return NextResponse.json(
        { error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" },
        { status: 400 }
      );
    }

    const connection = await pool.connect();
    
    // ค้นหาผู้ใช้
    const user = await connection
      .request()
      .input('username', username)
      .query('SELECT * FROM Users WHERE username = @username');

    if (user.recordset.length === 0) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // ตรวจสอบรหัสผ่าน
    const isValidPassword = await bcrypt.compare(
      password,
      user.recordset[0].password_hash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // สร้าง Token
    const token = jwt.sign(
      { userId: user.recordset[0].id },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    // ตั้งค่า Cookie
const response = NextResponse.json(
  { message: "ล็อกอินสำเร็จ" },
  { status: 200 }
);

response.cookies.set({
  name: 'token',
  value: token,
  httpOnly: true,
  secure: false, // ใน Development ตั้งเป็น false
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 วัน (หน่วยเป็นวินาที)
});

    return response;

  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในระบบ" },
      { status: 500 }
    );
  }
}