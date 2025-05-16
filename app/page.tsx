import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            ยินดีต้อนรับสู่ระบบสต็อคหนังสือ
          </h1>
          
          
          {/* ปุ่มลิงก์ไปหน้า Login/Register */}
          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              เข้าสู่ระบบ
            </Link>
            <Link
              href="/register"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg"
            >
              สมัครสมาชิก
            </Link>
          </div>
        </div>

        {/* ตัวอย่างหนังสือ (Optional) */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">หนังสือยอดนิยม</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ตัวอย่างหนังสือ 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">หนังสือตัวอย่าง 1</h3>
              <p className="text-gray-600">รายละเอียดหนังสือสั้นๆ</p>
            </div>
            
            {/* ตัวอย่างหนังสือ 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">หนังสือตัวอย่าง 2</h3>
              <p className="text-gray-600">รายละเอียดหนังสือสั้นๆ</p>
            </div>
            
            {/* ตัวอย่างหนังสือ 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">หนังสือตัวอย่าง 3</h3>
              <p className="text-gray-600">รายละเอียดหนังสือสั้นๆ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}