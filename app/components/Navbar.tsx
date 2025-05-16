'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        router.push('/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ตรวจสอบว่าไม่ใช่หน้า Login/Register
  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          Bookstore
        </Link>
        {/* แสดงปุ่ม Logout เฉพาะเมื่อไม่อยู่ในหน้า Login/Register */}
        {!isAuthPage && (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            ออกจากระบบ
          </button>
        )}
      </div>
    </nav>
  );
}