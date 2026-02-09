'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight, Wallet, UserCircle2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        ten_dang_nhap: '',
        mat_khau: '',
        xac_nhan_mat_khau: '',
        ho_ten: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.mat_khau !== formData.xac_nhan_mat_khau) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ten_dang_nhap: formData.ten_dang_nhap,
                    mat_khau: formData.mat_khau,
                    ho_ten: formData.ho_ten
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Có lỗi xảy ra khi đăng ký');
            } else {
                router.push('/login?registered=success');
            }
        } catch (err: any) {
            setError('Lỗi kết nối máy chủ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#F8FAFC]">
            {/* Soft Ambient Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-emerald-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="w-full max-w-[1000px] grid lg:grid-cols-2 bg-white/80 backdrop-blur-xl border border-white rounded-[40px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] relative z-10">

                {/* Right Side (branding for register) */}
                <div className="hidden lg:flex flex-col justify-between p-16 bg-slate-50/50 order-last">
                    <div>
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-black text-slate-900 tracking-tighter uppercase">Join Us</span>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-4xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                Bắt đầu tiết kiệm <br />
                                <span className="text-emerald-500 italic font-serif">Ngay từ hôm nay.</span>
                            </h2>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-sm">
                                Tạo tài khoản miễn phí và tham gia cộng đồng hơn 2,000 người dùng quản lý tiền thông minh.
                            </p>
                        </div>

                        <div className="mt-12 space-y-4">
                            {[
                                'Không tốn phí duy trì',
                                'Bảo mật dữ liệu 100%',
                                'Báo cáo chi tiết hàng tháng',
                                'Truy cập mọi lúc mọi nơi'
                            ].map((text, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                        <ArrowRight size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-xs text-slate-400 font-black uppercase tracking-widest italic">
                        #SmartFinance #ZeroFees
                    </div>
                </div>

                {/* Left Side: Register Form */}
                <div className="p-10 md:p-12 flex flex-col justify-center bg-white">
                    <div className="mb-8">
                        <Link href="/login" className="inline-flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest mb-6 hover:gap-3 transition-all">
                            Trở lại đăng nhập
                        </Link>
                        <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Tạo tài khoản</h1>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Hoàn toàn miễn phí & nhanh gọn.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl text-sm font-bold flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.1em]">Họ và tên</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                                    <UserCircle2 size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={formData.ho_ten}
                                    onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300 md:text-sm"
                                    placeholder="Nguyễn Văn A"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.1em]">Tên đăng nhập</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={formData.ten_dang_nhap}
                                    onChange={(e) => setFormData({ ...formData, ten_dang_nhap: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all text-slate-900 font-bold placeholder:text-slate-300 md:text-sm"
                                    placeholder="hoang_mai"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.1em]">Mật khẩu</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={formData.mat_khau}
                                        onChange={(e) => setFormData({ ...formData, mat_khau: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all text-slate-900 font-black placeholder:text-slate-300 md:text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-[0.1em]">Xác nhận</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        value={formData.xac_nhan_mat_khau}
                                        onChange={(e) => setFormData({ ...formData, xac_nhan_mat_khau: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary focus:bg-white transition-all text-slate-900 font-black placeholder:text-slate-300 md:text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4.5 bg-primary hover:opacity-90 text-white font-black rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 relative group active:scale-[0.98]"
                            >
                                <span className={cn("transition-all flex items-center gap-3", loading && "opacity-0 invisible")}>
                                    ĐĂNG KÝ NGAY <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                                {loading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
