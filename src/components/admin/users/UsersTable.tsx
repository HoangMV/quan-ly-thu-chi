import {
    Calendar,
    ShieldCheck,
    User as UserIcon,
    Edit2,
    Trash2,
    SearchX,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserData } from '@/hooks/useUsers'; // Or define interface here if circular dep issues

interface UsersTableProps {
    users: any[];
    loading: boolean;
    onEdit: (user: any) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: string) => void;
    onClearSearch: () => void;
}

export default function UsersTable({ users, loading, onEdit, onDelete, onStatusChange, onClearSearch }: UsersTableProps) {
    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm overflow-hidden min-h-[500px] flex flex-col items-center justify-center gap-4 animate-pulse">
                <Loader2 className="w-10 h-10 text-primary animate-spin" strokeWidth={3} />
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Đang đồng bộ cơ sở dữ liệu nhân sự...</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center p-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[40px] flex items-center justify-center text-slate-200 dark:text-slate-700 mb-8 border border-slate-100 dark:border-slate-700 shadow-inner">
                    <SearchX size={56} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Không tìm thấy thành viên</h3>
                <p className="text-slate-500 max-w-sm font-medium italic">Chúng tôi không tìm thấy kết quả phù hợp với từ khóa tìm kiếm của bạn.</p>
                <button
                    onClick={onClearSearch}
                    className="mt-10 px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-slate-200 transition-all active:scale-95"
                >
                    XEM TOÀN BỘ DANH SÁCH
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-sm overflow-hidden min-h-[500px] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
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
                        {users.map((u, index) => (
                            <tr
                                key={u._id}
                                className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all duration-300"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
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
                                        onClick={() => onStatusChange(u._id, u.trang_thai)}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 border shadow-sm cursor-pointer hover:shadow-md active:scale-95",
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
                                            onClick={() => onEdit(u)}
                                            className="p-3 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all active:scale-90"
                                            title="Chỉnh sửa thông tin"
                                        >
                                            <Edit2 size={18} strokeWidth={3} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(u._id)}
                                            className="p-3 text-slate-400 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 rounded-2xl shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all active:scale-90"
                                            title="Xóa vĩnh viễn"
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
        </div>
    );
}
