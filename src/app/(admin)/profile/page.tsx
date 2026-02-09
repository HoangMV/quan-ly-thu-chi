'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Camera, Shield, Check, AlertCircle, Loader2, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [previewUrl, setPreviewUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        ho_ten: '',
        email: '',
        so_dien_thoai: '',
        anh_dai_dien: ''
    });

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.user) {
                    setUser(data.user);
                    setFormData({
                        ho_ten: data.user.ho_ten || '',
                        email: data.user.email || '',
                        so_dien_thoai: data.user.so_dien_thoai || '',
                        anh_dai_dien: data.user.anh_dai_dien || ''
                    });
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result as string);
        reader.readAsDataURL(file);

        setIsUploading(true);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET || '');

            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formDataUpload
            });

            const data = await res.json();
            if (data.secure_url) {
                setFormData(prev => ({ ...prev, anh_dai_dien: data.secure_url }));
                setMessage({ type: 'success', text: 'Tải ảnh lên thành công!' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Lỗi khi tải ảnh lên Cloudinary. Kiểm tra config .env' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
                setUser(data.user);
            } else {
                setError(data.error);
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Lỗi khi cập nhật hồ sơ' });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Hồ sơ cá nhân</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Quản lý thông tin cá nhân và cài đặt định danh của bạn.</p>
            </div>

            {message.text && (
                <div className={cn(
                    "p-4 rounded-2xl flex items-center gap-3 border shadow-sm animate-in slide-in-from-top-2",
                    message.type === 'success' ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400"
                )}>
                    {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold text-sm tracking-tight">{message.text}</span>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Avatar Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-[32px] p-8 text-center shadow-sm relative overflow-hidden group">
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-xl bg-slate-100 dark:bg-slate-800">
                                {previewUrl || formData.anh_dai_dien ? (
                                    <img
                                        src={previewUrl || formData.anh_dai_dien}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <User size={64} strokeWidth={1.5} />
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform hover:shadow-primary/30 active:scale-95">
                                <Camera size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                            {isUploading && (
                                <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">{formData.ho_ten || user?.ten_dang_nhap}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                            {user?.vai_tro === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                        </p>

                        <div className="mt-8 pt-6 border-t border-border flex justify-around">
                            <div className="text-center">
                                <p className="text-lg font-black text-slate-900 dark:text-white">Active</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Trạng thái</p>
                            </div>
                            <div className="w-px h-8 bg-border"></div>
                            <div className="text-center">
                                <p className="text-lg font-black text-slate-900 dark:text-white">Pro</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Gói cước</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="lg:col-span-2 space-y-8">
                    <form onSubmit={handleUpdateProfile} className="bg-card border border-border rounded-[32px] p-8 shadow-sm space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Họ và tên</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.ho_ten}
                                        onChange={(e) => setFormData(prev => ({ ...prev, ho_ten: e.target.value }))}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
                                        placeholder="Tên của bạn..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Tên đăng nhập</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                                        <Shield size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={user?.ten_dang_nhap}
                                        disabled
                                        className="w-full pl-11 pr-4 py-3 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-not-allowed font-medium text-slate-400"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
                                        placeholder="example@gmail.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Số điện thoại</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        type="tel"
                                        value={formData.so_dien_thoai}
                                        onChange={(e) => setFormData(prev => ({ ...prev, so_dien_thoai: e.target.value }))}
                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-foreground"
                                        placeholder="0123 456 789"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={updating}
                                className="px-8 py-3 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                            >
                                {updating ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                LƯU THAY ĐỔI
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
