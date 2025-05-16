import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const connection = await pool.connect();
    const result = await connection.query('SELECT * FROM Books');
    connection.close();

    // ตรวจสอบให้ส่งกลับเป็น Array
    return NextResponse.json(result.recordset || []); 
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลหนังสือ" },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const { title, author, price, stock } = await request.json();
    const connection = await pool.connect();
    if (!title || !author || price <= 0 || stock < 0) {
  return NextResponse.json(
    { error: 'Invalid input' },
    { status: 400 }
  );
}
    
    await connection.request()
      .input('title', title)
      .input('author', author)
      .input('price', price)
      .input('stock', stock)
      .query('INSERT INTO Books (title, author, price, stock) VALUES (@title, @author, @price, @stock)');

    connection.close();
    return NextResponse.json(
      { message: 'Book created' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}