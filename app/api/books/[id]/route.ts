import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await pool.connect();
    const result = await connection
      .request()
      .input('id', params.id)
      .query('SELECT * FROM Books WHERE id = @id');
    
    connection.close();
    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await pool.connect();
    
    // ตรวจสอบว่าหนังสือมีอยู่จริง
    const checkBook = await connection
      .request()
      .input('id', params.id)
      .query('SELECT * FROM Books WHERE id = @id');

    if (checkBook.recordset.length === 0) {
      return NextResponse.json(
        { error: "ไม่พบหนังสือนี้ในระบบ" },
        { status: 404 }
      );
    }

    // ลบหนังสือ
    await connection
      .request()
      .input('id', params.id)
      .query('DELETE FROM Books WHERE id = @id');

    connection.close();
    return NextResponse.json(
      { message: "ลบหนังสือสำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบหนังสือ" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { title, author, price, stock } = await req.json();
    const connection = await pool.connect();
    
    await connection
      .request()
      .input('id', params.id)
      .input('title', title)
      .input('author', author)
      .input('price', price)
      .input('stock', stock)
      .query(`
        UPDATE Books 
        SET 
          title = @title,
          author = @author,
          price = @price,
          stock = @stock
        WHERE id = @id
      `);

    connection.close();
    return NextResponse.json(
      { message: 'Book updated' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}