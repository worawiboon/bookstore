import Link from 'next/link';
import { Book } from '@/types';

interface Props {
  books: Book[];
}

export default function BookList({ books }: Props) {

  const handleDelete = async (id: number) => {
    // ยืนยันการลบ
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือนี้?')) return;

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'ลบหนังสือไม่สำเร็จ');
      }

      // รีเฟรชหน้าหลังลบสำเร็จ
      window.location.reload();
    } catch (err) {
      
    }
  };
  if (!books || books.length === 0) {
    return <div className="text-center py-8">ไม่พบหนังสือในระบบ</div>;
    
  }
  

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-6 text-left">ชื่อหนังสือ</th>
            <th className="py-3 px-6 text-left">ผู้แต่ง</th>
            <th className="py-3 px-6 text-left">ราคา</th>
            <th className="py-3 px-6 text-left">สต็อก</th>
            <th className="py-3 px-6 text-left">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b hover:bg-gray-50">
              <td className="py-4 px-6">{book.title}</td>
              <td className="py-4 px-6">{book.author}</td>
              <td className="py-4 px-6">฿{book.price.toFixed(2)}</td>
              <td className="py-4 px-6">{book.stock}</td>
              <td className="py-4 px-6 space-x-2">
                <Link
                  href={`/books/edit/${book.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  แก้ไข
                </Link>
                <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(book.id)}>
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}