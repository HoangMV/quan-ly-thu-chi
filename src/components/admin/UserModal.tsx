'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Shield, Lock, Save, Loader2, UserPlus, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    userData?: any; // If editing
}

export default function UserModal({ isOpen, onClose, onSave, userData }: UserModalProps) {
    const [formData, setFormData] = useState({
        ten_dang_nhap: '',
        mat_khau: '',
        ho_ten: '',
        email: '',
        so_dien_thoai: '',
        vai_tro: 'user',
        trang_thai: 'active'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userData) {
            setFormData({
                ten_dang_nhap: userData.ten_dang_nhap || '',
                mat_khau: '', // Don't show existing password
                ho_ten: userData.ho_ten || '',
                email: userData.email || '',
                so_dien_thoai: userData.so_dien_thoai || '',
                vai_tro: userData.vai_tro || 'user',
                trang_thai: userData.trang_thai || 'active'
            });
        } else {
            setFormData({
                ten_dang_nhap: '',
                mat_khau: '',
                ho_ten: '',
                email: '',
                so_dien_thoai: '',
                vai_tro: 'user',
                trang_thai: 'active'
            });
        }
    }, [userData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onSave(userData ? { ...formData, userId: userData._id } : formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 relative overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-full transition-all active:scale-95 z-10"
                >
                    <X size={20} />
                </button>

                {/* Modal Header */}
                <div className="p-8 pb-4 border-b border-slate-50 dark:border-slate-800/50 flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                        {userData ? <Edit2 size={24} /> : <UserPlus size={24} />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                            {userData ? 'Cập nhật tài khoản' : 'Thêm người dùng mới'}
                        </h2>
                        <p className="text-slate-500 text-sm font-medium italic">
                            {userData ? `Chỉnh sửa thông tin cho @${userData.ten_dang_nhap}` : 'Khởi tạo tài khoản mới trong hệ thống '}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 text-rose-500 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in shake-in">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Họ và tên</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={formData.ho_ten}
                                    onChange={e => setFormData({ ...formData, ho_ten: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 md:text-sm font-medium"
                                    placeholder="Tên hiển thị..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Tên đăng nhập</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    disabled={!!userData}
                                    value={formData.ten_dang_nhap}
                                    onChange={e => setFormData({ ...formData, ten_dang_nhap: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 md:text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Username..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">{userData ? 'Mật khẩu mới (Nếu cần đổi)' : 'Mật khẩu'}</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    required={!userData}
                                    value={formData.mat_khau}
                                    onChange={e => setFormData({ ...formData, mat_khau: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 md:text-sm font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Email liên hệ</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 md:text-sm font-medium"
                                    placeholder="mail@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Số điện thoại</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="tel"
                                    value={formData.so_dien_thoai}
                                    onChange={e => setFormData({ ...formData, so_dien_thoai: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 md:text-sm font-medium"
                                    placeholder="09xxx..."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Vai trò hệ thống</label>
                            <div className="relative group">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                <select
                                    value={formData.vai_tro}
                                    onChange={e => setFormData({ ...formData, vai_tro: e.target.value as any })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white appearance-none cursor-pointer md:text-sm font-black uppercase tracking-widest bg-no-repeat bg-[right_1rem_center]"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='Length 19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundSize: '1.2em' }}
                                >
                                    <option value="user">USER (Người dùng)</option>
                                    <option value="admin">ADMIN (Quản trị)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-[0.98]"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 disabled:bg-slate-300 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {userData ? 'CẬP NHẬT DỮ LIỆU' : 'XÁC NHẬN TẠO MỚI'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

