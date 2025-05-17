import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

interface OrderRequest {
  items: {
    bookId: number;
    quantity: number;
  }[];
}

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.split(' ')[1] || '';
  
  try {
    // ตรวจสอบ Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const connection = await pool.connect();

    // คำนวณราคารวม
    let total = 0;
    const orderItems = [];

    // ตรวจสอบสต็อกและคำนวณราคา
    for (const item of (await req.json()).items) {
      const book = await connection
        .request()
        .input('id', item.bookId)
        .query('SELECT price, stock FROM Books WHERE id = @id');

      if (book.recordset[0].stock < item.quantity) {
        throw new Error(`หนังสือ ID ${item.bookId} สต็อกไม่เพียงพอ`);
      }

      total += book.recordset[0].price * item.quantity;
      orderItems.push({
        bookId: item.bookId,
        quantity: item.quantity,
        price: book.recordset[0].price
      });
    }

    // สร้าง Order
    const orderResult = await connection
      .request()
      .input('user_id', decoded.userId)
      .input('total_price', total)
      .query('INSERT INTO Orders (user_id, total_price) OUTPUT INSERTED.id VALUES (@user_id, @total_price)');

    // เพิ่ม Order Items
    for (const item of orderItems) {
      await connection
        .request()
        .input('order_id', orderResult.recordset[0].id)
        .input('book_id', item.bookId)
        .input('quantity', item.quantity)
        .input('price', item.price)
        .query('INSERT INTO OrderItems (order_id, book_id, quantity, price) VALUES (@order_id, @book_id, @quantity, @price)');

      // ลดสต็อกหนังสือ
      await connection
        .request()
        .input('id', item.bookId)
        .input('quantity', item.quantity)
        .query('UPDATE Books SET stock = stock - @quantity WHERE id = @id');
    }

    connection.close();
    return NextResponse.json({ message: "สั่งซื้อสำเร็จ", orderId: orderResult.recordset[0].id });
  } catch (error) {
    return NextResponse.json({ error: error}, { status: 400 });
  }
}