"use client"

import { useEffect, useState } from 'react';
import BookList from '@/app/components/BookList';
import { Book } from '@/types';
import Link from 'next/link';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books', {
          credentials: 'include' // ส่ง Cookies
        });
        
        if (!res.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลหนังสือได้');
        }
        
        const data = await res.json();
        setBooks(data);
        setError('');
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลหนังสือ');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  if (loading) {
    return <div className="text-center py-8">กำลังโหลด...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">รายการหนังสือทั้งหมด</h1>
      {/* ปุ่มเพิ่มหนังสือ */}
      <Link
        href="/books/create"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        เพิ่มหนังสือใหม่
      </Link>
    </div>
    <BookList books={books} />
  </div>
  );
}