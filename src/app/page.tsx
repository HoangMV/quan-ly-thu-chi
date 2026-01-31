'use client';

import { useEffect, useState } from 'react';
import ExpenseTracker from '@/components/ExpenseTracker';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<{ _id: string; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra xem đã đăng nhập chưa
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          router.push('/login'); // Chưa đăng nhập thì đá về trang login
        }
      } catch (error) {
        console.error('Lỗi kiểm tra đăng nhập:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  if (!user) return null; // Tránh flash nội dung khi chưa load xong

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      {/* Header nhỏ hiển thị tên user và nút đăng xuất */}
      <div className="absolute top-4 right-4 flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
        <span className="text-gray-700 font-medium">Xin chào, {user.username}</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
        >
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>

      <ExpenseTracker />
    </div>
  );
}
