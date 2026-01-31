'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus } from 'lucide-react';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true); // Toggle Login/Register
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const url = isLogin ? '/api/auth/login' : '/api/auth/register';

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            let data;
            try {
                data = await res.json();
            } catch (jsonError) {
                console.error("JSON Error:", jsonError);
                throw new Error("Lỗi kết nối Server (Không nhận được phản hồi JSON)");
            }

            if (!res.ok) {
                setError(data.error || 'Có lỗi xảy ra');
            } else {
                // Thành công -> Chuyển hướng về trang chủ
                router.push('/');
                router.refresh(); // Load lại dữ liệu mới nhất
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        {isLogin ? 'Chào mừng bạn quay lại!' : 'Tạo tài khoản mới để bắt đầu'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Đang xử lý...' : (
                            <>
                                {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                                {isLogin ? 'Đăng Nhập' : 'Đăng Ký Ngay'}
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => { setIsLogin(!isLogin); setError(''); }}
                        className="text-sm text-blue-600 hover:underline font-medium"
                    >
                        {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
                    </button>
                </div>
            </div>
        </div>
    );
}
