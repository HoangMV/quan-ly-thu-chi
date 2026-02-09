'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Calendar,
    Filter,
    Plus,
    ArrowRight,
    ArrowLeftRight
} from 'lucide-react';
import StatCard from './StatCard';
import TransactionTable from './TransactionTable';
import AddTransactionForm from './AddTransactionForm';
import { cn } from '@/lib/utils';

interface Transaction {
    _id: string;
    mo_ta: string;
    so_tien: number;
    loai: 'income' | 'expense';
    danh_muc: string;
    ngay_thang: string;
    nguoi_chi?: string;
}

export default function DashboardContainer() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/transactions');
            const data = await res.json();
            if (data.success) {
                setTransactions(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handleAddTransaction = async (formData: any) => {
        try {
            // Map component fields to API fields
            const apiData = {
                mo_ta: formData.description,
                so_tien: formData.amount,
                loai: formData.type,
                danh_muc: formData.category,
                nguoi_chi: formData.spender,
                ngay_thang: new Date()
            };

            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(apiData),
            });
            const data = await res.json();
            if (data.success) {
                setTransactions(prev => [data.data, ...prev]);
                setShowAddForm(false);
            }
        } catch (error) {
            console.error('Failed to add transaction:', error);
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) return;
        try {
            const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTransactions(prev => prev.filter(t => t._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete transaction:', error);
        }
    };

    // Filter transactions by selected month
    const filteredTransactions = transactions.filter(t => {
        const tMonth = new Date(t.ngay_thang).toISOString().slice(0, 7);
        return tMonth === selectedMonth;
    });

    // Stats calculation based on FILTERED transactions
    const totalIncome = filteredTransactions
        .filter(t => t.loai === 'income')
        .reduce((acc, t) => acc + t.so_tien, 0);

    const totalExpense = filteredTransactions
        .filter(t => t.loai === 'expense')
        .reduce((acc, t) => acc + t.so_tien, 0);

    const balance = totalIncome - totalExpense;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header with Stats Overview */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <ArrowLeftRight className="text-primary" size={32} strokeWidth={3} />
                        QUẢN LÝ THU CHI
                    </h1>
                    <p className="text-slate-500 font-medium italic">Theo dõi, kiểm soát và tối ưu hóa dòng tiền của bạn.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={18} />
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-primary text-white px-5 py-2.5 rounded-xl font-black text-sm hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                    >
                        <Plus size={18} />
                        THÊM MỚI
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Tổng số dư"
                    value={`${balance.toLocaleString('vi-VN')} đ`}
                    icon={Wallet}
                    variant="indigo"
                    trend={{ value: `${totalIncome > 0 ? '+' : ''}${((balance / (totalIncome || 1)) * 100).toFixed(1)}%`, isUp: balance >= 0 }}
                />
                <StatCard
                    label="Thu nhập tháng"
                    value={`${totalIncome.toLocaleString('vi-VN')} đ`}
                    icon={TrendingUp}
                    variant="green"
                    trend={{ value: "Tháng này", isUp: true }}
                />
                <StatCard
                    label="Chi tiêu tháng"
                    value={`${totalExpense.toLocaleString('vi-VN')} đ`}
                    icon={TrendingDown}
                    variant="red"
                    trend={{ value: "Tháng này", isUp: false }}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Table Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-border flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                                <Filter size={18} className="text-primary" />
                                GIAO DỊCH GẦN ĐÂY
                            </h3>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-border">
                                {filteredTransactions.length} Giao dịch
                            </span>
                        </div>
                        <TransactionTable
                            transactions={filteredTransactions.map(t => ({
                                _id: t._id,
                                description: t.mo_ta,
                                amount: t.so_tien,
                                type: t.loai,
                                category: t.danh_muc,
                                date: t.ngay_thang,
                                spender: t.nguoi_chi
                            }))}
                            onDelete={handleDeleteTransaction}
                            isLoading={loading}
                        />
                    </div>
                </div>

                {/* Sidebar/Widgets Section */}
                <div className="space-y-6">
                    <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            PHÂN BỔ CHI TIÊU
                        </h3>
                        <div className="space-y-5">
                            {[
                                { name: 'Ăn uống', amount: '2.500.000 đ', percent: 45, color: 'bg-primary' },
                                { name: 'Di chuyển', amount: '800.000 đ', percent: 15, color: 'bg-emerald-500' },
                                { name: 'Giải trí', amount: '1.200.000 đ', percent: 25, color: 'bg-amber-500' },
                                { name: 'Khác', amount: '500.000 đ', percent: 15, color: 'bg-slate-400' },
                            ].map(cat => (
                                <div key={cat.name} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{cat.name}</span>
                                        <span className="font-bold text-primary">{cat.amount}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className={cn("h-full rounded-full transition-all duration-1000 shadow-sm", cat.color)} style={{ width: `${cat.percent}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-10 py-3 text-sm font-black text-slate-500 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl transition-all uppercase tracking-widest">
                            Xem chi tiết báo cáo
                        </button>
                    </div>

                    <div className="bg-linear-to-br from-primary to-violet-700 rounded-[32px] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-3 italic tracking-tighter">NÂNG CẤP PRO</h3>
                            <p className="text-primary-100 text-sm mb-6 leading-relaxed opacity-90 font-medium italic">Mở khóa tính năng biểu đồ thông minh và dự báo tài chính bằng AI.</p>
                            <button className="bg-white text-primary px-6 py-3 rounded-2xl text-xs font-black hover:bg-slate-50 transition-all uppercase tracking-widest shadow-lg shadow-black/10 active:scale-95">
                                Tìm hiểu thêm
                            </button>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showAddForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-xl animate-in zoom-in-95 duration-300 slide-in-from-bottom-5">
                        <AddTransactionForm
                            onSubmit={handleAddTransaction}
                            onClose={() => setShowAddForm(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
