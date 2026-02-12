import { Search, Filter, SearchX } from 'lucide-react';

interface UsersFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export default function UsersFilter({ searchTerm, onSearchChange }: UsersFilterProps) {
    return (
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-100 dark:border-slate-800 p-3 rounded-[32px] flex flex-col md:flex-row gap-4 items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex-1 relative w-full group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-all duration-300 pointer-events-none" size={20} />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên, username hoặc email..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-sm font-bold placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm"
                />
                {searchTerm && (
                    <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                        <SearchX size={18} />
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className="px-4 py-2 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 dark:border-slate-700 mr-2 select-none">
                    <Filter size={14} /> BỘ LỌC
                </div>
                <button className="px-4 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-[10px] font-black shadow-sm tracking-widest border border-slate-100 dark:border-slate-600 transition-all hover:shadow-md active:scale-95">
                    TẤT CẢ
                </button>
                <button className="px-4 py-2 text-slate-500 hover:text-primary transition-colors text-[10px] font-black tracking-widest active:scale-95">
                    ADMIN
                </button>
            </div>
        </div>
    );
}
