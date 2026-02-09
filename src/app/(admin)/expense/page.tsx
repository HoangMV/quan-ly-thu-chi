'use client';

import { Construction } from 'lucide-react';

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full">
                <Construction size={48} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Tính năng đang được phát triển</h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                Chúng tôi đang nỗ lực hoàn thiện tính năng này. Vui lòng quay lại sau!
            </p>
            <button
                onClick={() => window.history.back()}
                className="px-6 py-2 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all"
            >
                Quay lại
            </button>
        </div>
    );
}
