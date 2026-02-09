'use client';

import {
    TrendingUp,
    TrendingDown,
    MoreVertical,
    Trash2,
    Edit3,
    Calendar,
    User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Transaction {
    _id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    spender?: string;
}

interface TransactionTableProps {
    transactions: Transaction[];
    onDelete: (id: string) => void;
    isLoading?: boolean;
}

export default function TransactionTable({ transactions, onDelete, isLoading }: TransactionTableProps) {
    if (isLoading) {
        return (
            <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Đang tải giao dịch...</p>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-4">
                    <Calendar size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Không tìm thấy dữ liệu</h3>
                <p className="text-slate-500 mt-1 max-w-xs">Bạn chưa có giao dịch nào được ghi lại trong khoảng thời gian này.</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-border">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mô tả</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phân loại</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tháng</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Người chi</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Số tiền</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                        {transactions.map((t) => (
                            <tr key={t._id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                            t.type === 'income'
                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20"
                                                : "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-900/10 dark:text-rose-400 dark:border-rose-900/20"
                                        )}>
                                            {t.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white leading-tight">{t.description}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{t.category}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                        {t.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Calendar size={14} className="text-slate-400" />
                                        {new Date(t.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200 dark:border-slate-700 uppercase">
                                            {t.spender?.charAt(0) || <UserIcon size={12} />}
                                        </div>
                                        {t.spender || 'Chung'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <p className={cn(
                                        "font-bold text-sm",
                                        t.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                                    )}>
                                        {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')} đ
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all shadow-sm">
                                            <Edit3 size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(t._id)}
                                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all shadow-sm"
                                        >
                                            <Trash2 size={16} />
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
