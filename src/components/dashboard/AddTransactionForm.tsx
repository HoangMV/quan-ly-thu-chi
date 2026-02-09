'use client';

import { useState } from 'react';
import { Plus, Wallet, Tag, User, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTransactionFormProps {
    onSubmit: (data: any) => Promise<void>;
    onClose?: () => void;
}

export default function AddTransactionForm({ onSubmit, onClose }: AddTransactionFormProps) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [spender, setSpender] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                description,
                amount: Number(amount),
                type,
                category: category || 'Chung',
                spender: spender || 'Chung',
            });
            // Reset form
            setDescription('');
            setAmount('');
            setCategory('');
            setSpender('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-card rounded-[32px] border border-border shadow-2xl p-8 relative overflow-hidden group">
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-full transition-all active:scale-95"
                >
                    <X size={20} />
                </button>
            )}

            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                    <Plus size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Thêm giao dịch</h2>
                    <p className="text-slate-500 text-sm font-medium">Ghi lại các khoản thu chi mới của bạn.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Mô tả</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                <Wallet size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="VD: Lương tháng 5, Tiền điện..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 md:text-sm font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Số tiền (VNĐ)</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 group-focus-within:text-primary transition-colors text-sm">
                                ₫
                            </div>
                            <input
                                type="number"
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 md:text-sm font-black"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Phân loại</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                <Tag size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Ăn uống, Di chuyển..."
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 md:text-sm font-medium"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Người thực hiện</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Tên người chi..."
                                value={spender}
                                onChange={(e) => setSpender(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-400 md:text-sm font-medium"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">Loại giao dịch</label>
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setType('expense')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all",
                                type === 'expense'
                                    ? "bg-white dark:bg-slate-800 text-rose-600 shadow-md border border-slate-100 dark:border-slate-700 active:scale-[0.98]"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            <ArrowDownLeft size={18} /> CHI TIÊU
                        </button>
                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all",
                                type === 'income'
                                    ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-md border border-slate-100 dark:border-slate-700 active:scale-[0.98]"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            <ArrowUpRight size={18} /> THU NHẬP
                        </button>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:opacity-90 disabled:bg-slate-300 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Plus size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                                GHI LẠI GIAO DỊCH
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
