'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(formData),
      credentials: 'include', // ส่ง Cookies
      redirect: 'manual' // ปิดการ Redirect อัตโนมัติ
    });

    if (res.ok) {
      // 1. บังคับโหลดหน้าใหม่ทั้งหน้า
      window.location.href = '/books';
      // 2. รีเฟรชข้อมูลเพื่อป้องกัน Cache
      window.location.reload();
    } else {
      const data = await res.json();
      setError(data.error || 'ล็อกอินล้มเหลว');
    }
  } catch (err) {
    setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
  }
};

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ล็อกอิน</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="ชื่อผู้ใช้"
          required
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="รหัสผ่าน"
          required
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          ล็อกอิน
        </button>
      </form>
    </div>
  );
}