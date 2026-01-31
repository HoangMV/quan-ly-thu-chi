'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface Transaction {
    _id: string;
    description: string;
    amount: number;
    spender?: string;
    type: 'income' | 'expense';
    category: string;
    date: string;
}

export default function ExpenseTracker() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [category, setCategory] = useState('');
    const [spender, setSpender] = useState('');

    // State cho bộ lọc tháng (Mặc định lấy tháng hiện tại: YYYY-MM)
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

    // Fetch transactions
    const fetchTransactions = async () => {
        try {
            const res = await fetch('/api/transactions');
            const data = await res.json();
            if (data.success) {
                setTransactions(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Helper kiểm tra giao dịch có thuộc tháng đang chọn không
    const filteredTransactions = transactions; // Tạm thời bỏ lọc để xem data có về không

    // Add transaction
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount) return;

        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description,
                    amount: Number(amount),
                    type,
                    category: category || 'Chung',
                    date: new Date(),
                    spender: spender || 'Chung',
                }),
            });
            const data = await res.json();
            if (data.success) {
                setTransactions([data.data, ...transactions]);
                setDescription('');
                setAmount('');
                setCategory('');
                setSpender('');
            }
        } catch (error) {
            console.error('Failed to add', error);
        }
    };

    // Delete transaction
    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa?')) return;
        try {
            await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
            setTransactions(transactions.filter((t) => t._id !== id));
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };

    // Calculate stats based on FILTERED transactions
    const income = filteredTransactions
        .filter((t) => t.type === 'income')
        .reduce((acc, t) => acc + t.amount, 0);

    const expense = filteredTransactions
        .filter((t) => t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expense;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Quản Lý Thu Chi
                </h1>
                <div className="flex justify-center items-center gap-2 mt-4">
                    <label className="text-gray-600 font-medium">Xem tháng:</label>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Số dư hiện tại</p>
                        <p className="text-2xl font-bold text-gray-900">{balance.toLocaleString('vi-VN')} đ</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tổng thu</p>
                        <p className="text-2xl font-bold text-green-600">+{income.toLocaleString('vi-VN')} đ</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 bg-red-100 text-red-600 rounded-full">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tổng chi</p>
                        <p className="text-2xl font-bold text-red-600">-{expense.toLocaleString('vi-VN')} đ</p>
                    </div>
                </div>
            </div>

            {/* Input Form */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Thêm giao dịch mới
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4">
                        <input
                            type="text"
                            placeholder="Mô tả (VD: Lương, Ăn sáng...)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                            required
                        />
                    </div>
                    <div className="md:col-span-3">
                        <input
                            type="number"
                            placeholder="Số tiền"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="Người chi"
                            value={spender}
                            onChange={(e) => setSpender(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        >
                            <option value="expense">Chi tiêu</option>
                            <option value="income">Thu nhập</option>
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={18} /> Thêm
                        </button>
                    </div>
                </form>
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Lịch sử giao dịch</h3>
                {loading ? (
                    <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
                ) : transactions.length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">Chưa có giao dịch nào.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            {transactions.map((t) => (
                                <li key={t._id} className="p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center",
                                            t.type === 'income' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                        )}>
                                            {t.type === 'income' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {t.description}
                                                {t.spender && <span className="text-sm font-normal text-gray-500 ml-2">({t.spender})</span>}
                                            </p>
                                            <p className="text-xs text-gray-500">{new Date(t.date).toLocaleDateString('vi-VN')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={cn(
                                            "font-bold",
                                            t.type === 'income' ? "text-green-600" : "text-red-600"
                                        )}>
                                            {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('vi-VN')} đ
                                        </span>
                                        <button
                                            onClick={() => handleDelete(t._id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
