'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, User, Lock, ArrowRight, Wallet, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const [ten_dang_nhap, setTenDangNhap] = useState('');
    const [mat_khau, setMatKhau] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ten_dang_nhap, mat_khau }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Tài khoản hoặc mật khẩu không chính xác');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            setError('Lỗi kết nối đến máy chủ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#F8FAFC]">
            {/* Soft Ambient Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-sky-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-[1000px] grid lg:grid-cols-2 bg-white/80 backdrop-blur-xl border border-white rounded-[40px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] relative z-10">

                {/* Left Side: Clean Branding */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <Wallet className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-black text-slate-900 tracking-tighter">FINTRACK</span>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-4xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                Giải pháp <br />
                                <span className="text-primary italic font-serif">Tài chính sạch</span> <br />
                                cho người hiện đại.
                            </h2>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                                Hành trình tự do tài chính bắt đầu từ thói quen ghi chép nhỏ nhất mỗi ngày.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            +2,000 người tin dùng
                        </p>
                    </div>
                </div>

                {/* Right Side: Simple Login Form */}
                <div className="p-10 md:p-16 flex flex-col justify-center bg-white">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Chào buổi sáng!</h1>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Đăng nhập vào hệ thống của bạn</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl text-sm font-bold flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 ml-1 uppercase tracking-widest">Tài khoản</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={ten_dang_nhap}
                                    onChange={(e) => setTenDangNhap(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300"
                                    placeholder="your_username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mật khẩu</label>
                                <a href="#" className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors uppercase tracking-wider">Quên mật khẩu?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={mat_khau}
                                    onChange={(e) => setMatKhau(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all text-slate-900 font-black placeholder:text-slate-300"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4.5 bg-primary hover:opacity-90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 relative group active:scale-[0.98]"
                        >
                            <span className={cn("transition-all flex items-center gap-3", loading && "opacity-0 invisible")}>
                                TRUY CẬP NGAY <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-slate-400 text-sm font-bold">
                            Lần đầu sử dụng?{' '}
                            <Link href="/register" className="text-primary hover:underline ml-1">Tạo tài khoản mới</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer Tag */}
            <div className="absolute bottom-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] z-10">
                Secure Banking Platform v4.0
            </div>
        </div>
    );
}
