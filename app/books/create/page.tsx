'use client'; // ต้องใช้ client component เพราะมีฟอร์มและ state

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Book } from '@/types';

export default function CreateBookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
  title: '',
  author: '',
  price: '', // เก็บเป็น string ชั่วคราว
  stock: ''
});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
  body: JSON.stringify({
    ...formData,
    price: parseFloat(formData.price),
    stock: parseInt(formData.stock)
  })
});

      if (!response.ok) {
        throw new Error('Failed to create book');
      }

      router.push('/books');
      router.refresh(); // อัปเดตข้อมูลในหน้า books
    } catch (err) {
      setError(error || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value // เก็บเป็น string
  }));
};

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Add New Book</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium mb-2">Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        {/* Price */}
        <div>
  <label className="block text-sm font-medium mb-2">Price</label>
  <input
    type="text" // เปลี่ยนเป็น text input
    name="price"
    value={formData.price}
    onChange={handleChange}
    className="w-full p-3 border rounded-lg"
    inputMode="decimal"
    pattern="[0-9]*\.?[0-9]*"
    required
  />
</div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            min="0"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors
            ${isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'}
          `}
        >
          {isSubmitting ? 'Creating...' : 'Create Book'}
        </button>
      </form>
    </div>
  );
}