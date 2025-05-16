import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    const connection = await pool.connect();
    
    // ตรวจสอบผู้ใช้ซ้ำ
    const checkUser = await connection
      .request()
      .input('username', username)
      .input('email', email)
      .query('SELECT * FROM Users WHERE username = @username OR email = @email');

    if (checkUser.recordset.length > 0) {
      return NextResponse.json(
        { error: 'Username หรืออีเมลนี้ถูกใช้แล้ว' },
        { status: 400 }
      );
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกผู้ใช้ใหม่
    await connection
      .request()
      .input('username', username)
      .input('email', email)
      .input('password_hash', hashedPassword)
      .query('INSERT INTO Users (username, email, password_hash) VALUES (@username, @email, @password_hash)');

    connection.close();
    return NextResponse.json(
      { message: 'สมัครสมาชิกสำเร็จ' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}