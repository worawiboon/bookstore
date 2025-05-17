'use client';
import { useEffect, useState } from 'react';

interface Order {
  id: number;
  total_price: number;
  created_at: string;
  items: {
    title: string;
    quantity: number;
    price: number;
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ประวัติการสั่งซื้อ</h1>
      {orders.map((order) => (
        <div key={order.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
          <div className="flex justify-between mb-4">
            <div>
              <p className="font-bold">หมายเลขคำสั่งซื้อ: #{order.id}</p>
              <p className="text-gray-600">วันที่: {new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <p className="text-2xl font-bold">฿{order.total_price.toFixed(2)}</p>
          </div>
          <div className="border-t pt-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <p>{item.title}</p>
                <p>{item.quantity} x ฿{item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}