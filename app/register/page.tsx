'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() { // ต้องมี default export
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    
    if (!res.ok) {
      // แปลง Error Object เป็น String
      let errorMessage = 'การสมัครล้มเหลว';
      if (data.error) {
        if (typeof data.error === 'string') {
          errorMessage = data.error;
        } else {
          errorMessage = JSON.stringify(data.error);
        }
      }
      setError(errorMessage);
      return;
    }

    router.push('/login');
  } catch (err) {
    setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
  }
};
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">สมัครสมาชิก</h1>
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
          type="email"
          name="email"
          placeholder="อีเมล"
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          สมัครสมาชิก
        </button>
      </form>
    </div>
  );
}