'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Users,
    Search,
    UserPlus,
    ShieldCheck,
    User as UserIcon,
    Trash2,
    Calendar,
    BadgeCheck,
    XCircle,
    Edit2,
    Loader2,
    SearchX,
    UserCheck,
    UserX,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import UserModal from '@/components/admin/UserModal';
import StatCard from '@/components/dashboard/StatCard';

interface UserData {
    _id: string;
    ten_dang_nhap: string;
    ho_ten: string;
    email?: string;
    so_dien_thoai?: string;
    anh_dai_dien?: string;
    vai_tro: 'admin' | 'user';
    trang_thai: 'active' | 'inactive';
    createdAt: string;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
            } else {
                setError(data.error || 'Bạn không có quyền truy cập');
            }
        } catch (err) {
            setError('Lỗi kết nối máy chủ');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSaveUser = async (formData: any) => {
        const method = editingUser ? 'PUT' : 'POST';
        const res = await fetch('/api/admin/users', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Lỗi khi lưu người dùng');
        }

        fetchUsers();
    };

    const toggleUserStatus = async (userId: string, currentStatus: string) => {
        try {
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, trang_thai: newStatus }),
            });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteUser = async (userId: string) => {
        if (!confirm('Xóa vĩnh viễn người dùng này?')) return;
        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
            if (res.ok) fetchUsers();
            else {
                const data = await res.json();
                alert(data.error || 'Lỗi khi xóa');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredUsers = users.filter(u =>
        u.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.ten_dang_nhap.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 animate-in fade-in duration-500">
                <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/10 text-rose-500 rounded-[40px] flex items-center justify-center mb-8 border border-rose-100 dark:border-rose-900/20 shadow-sm">
                    <XCircle size={56} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">Quyền truy cập bị từ chối</h1>
                <p className="text-slate-500 max-w-sm font-medium italic mb-10 leading-relaxed">Xin lỗi, bạn cần cấp quyền Quản trị viên cao cấp để truy cập vào trung tâm quản lý nhân sự.</p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-10 py-4 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-slate-200 dark:shadow-primary/20 transition-all active:scale-95 hover:opacity-90"
                >
                    Quay lại trang chủ
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Users className="text-primary" size={32} strokeWidth={3} />
                        QUẢN LÝ NGƯỜI DÙNG
                    </h1>
                    <p className="text-slate-500 font-medium italic mt-1">Quản lý tài khoản, phân quyền và bảo mật hệ thống.</p>
                </div>

                <button
                    onClick={() => { setEditingUser(null); setModalOpen(true); }}
                    className="bg-primary text-white px-8 py-4 rounded-[20px] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-primary/20"
                >
                    <UserPlus size={18} strokeWidth={3} />
                    THÊM NGƯỜI DÙNG
                </button>
            </div>

            {/* Stats Grid Overlaying consistent pattern */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Tổng thành viên"
                    value={users.length}
                    icon={Users}
                    variant="primary"
                />
                <StatCard
                    label="Đang hoạt động"
                    value={users.filter(u => u.trang_thai === 'active').length}
                    icon={UserCheck}
                    variant="green"
                />
                <StatCard
                    label="Đã bị khóa"
                    value={users.filter(u => u.trang_thai === 'inactive').length}
                    icon={UserX}
                    variant="red"
                />
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-100 dark:border-slate-800 p-3 rounded-[32px] flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 relative w-full group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-all duration-300" size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, username hoặc email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="px-4 py-2 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-700 mr-2">
                        <Filter size={14} /> BỘ LỌC
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-[10px] font-black shadow-sm tracking-widest border border-slate-100 dark:border-slate-600">
                        TẤT CẢ
                    </button>
                    <button className="px-4 py-2 text-slate-500 hover:text-primary transition-colors text-[10px] font-black tracking-widest">
                        ADMIN
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm overflow-hidden min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-[500px] gap-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" strokeWidth={3} />
                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] animate-pulse">Đang đồng bộ cơ sở dữ liệu nhân sự...</p>
                    </div>
                ) : filteredUsers.length > 0 ? (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">THÀNH VIÊN</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">VAI TRÒ</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">TRẠNG THÁI</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">HOẠT ĐỘNG</th>
                                    <th className="px-8 py-6 text-right w-[140px]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all duration-300">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-500 font-black text-lg shadow-sm border border-white dark:border-slate-800 overflow-hidden group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                                    {u.anh_dai_dien ? (
                                                        <img src={u.anh_dai_dien} alt={u.ho_ten} className="w-full h-full object-cover" />
                                                    ) : (
                                                        u.ho_ten.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white leading-none mb-1.5">{u.ho_ten}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-primary tracking-widest uppercase">@{u.ten_dang_nhap}</span>
                                                        {u.email && <span className="text-[10px] font-medium text-slate-400 block truncate max-w-[150px]">• {u.email}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase border transition-all",
                                                u.vai_tro === 'admin'
                                                    ? "bg-indigo-50 dark:bg-indigo-900/10 text-indigo-600 border-indigo-100 dark:border-indigo-900/30"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                                            )}>
                                                {u.vai_tro === 'admin' ? <ShieldCheck size={12} strokeWidth={3} /> : <UserIcon size={12} strokeWidth={3} />}
                                                {u.vai_tro}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <button
                                                onClick={() => toggleUserStatus(u._id, u.trang_thai)}
                                                className={cn(
                                                    "px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 border shadow-sm",
                                                    u.trang_thai === 'active'
                                                        ? "text-emerald-500 bg-white dark:bg-slate-800 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200"
                                                        : "text-rose-500 bg-white dark:bg-slate-800 border-rose-100 hover:bg-rose-50 hover:border-rose-200"
                                                )}
                                            >
                                                <div className={cn("w-1.5 h-1.5 rounded-full", u.trang_thai === 'active' ? "bg-emerald-500 animate-pulse" : "bg-rose-500")}></div>
                                                {u.trang_thai === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                                            </button>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-2">
                                                <Calendar size={14} className="opacity-40" />
                                                {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                                <button
                                                    onClick={() => { setEditingUser(u); setModalOpen(true); }}
                                                    className="p-3 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all"
                                                >
                                                    <Edit2 size={18} strokeWidth={3} />
                                                </button>
                                                <button
                                                    onClick={() => deleteUser(u._id)}
                                                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all"
                                                >
                                                    <Trash2 size={18} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[40px] flex items-center justify-center text-slate-200 dark:text-slate-700 mb-8 border border-slate-100 dark:border-slate-700 shadow-inner">
                            <SearchX size={56} strokeWidth={1} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Không tìm thấy thành viên</h3>
                        <p className="text-slate-500 max-w-sm font-medium italic">Chúng tôi không tìm thấy kết quả phù hợp với từ khóa tìm kiếm của bạn.</p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="mt-10 px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-slate-200 transition-all active:scale-95"
                        >
                            XEM TOÀN BỘ DANH SÁCH
                        </button>
                    </div>
                )}
            </div>

            {/* Modal Components */}
            <UserModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveUser}
                userData={editingUser}
            />

            {/* Subtle Footer Tag Consistency */}
            <div className="flex justify-center pt-4 opacity-30 italic">
                <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">User Management System v1.2</p>
            </div>
        </div>
    );
}
