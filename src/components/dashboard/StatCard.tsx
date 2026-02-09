'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        isUp: boolean;
    };
    variant?: 'blue' | 'green' | 'red' | 'indigo' | 'slate' | 'primary';
}

const variants = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/20',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20',
    red: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/10 dark:text-rose-400 dark:border-rose-900/20',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/10 dark:text-indigo-400 dark:border-indigo-900/20',
    slate: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/10 dark:text-slate-400 dark:border-slate-900/20',
    primary: 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30',
};

export default function StatCard({ label, value, icon: Icon, trend, variant = 'blue' }: StatCardProps) {
    return (
        <div className="group bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110 duration-300", variants[variant])}>
                    <Icon size={22} strokeWidth={2.5} />
                </div>
                {trend && (
                    <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded-full",
                        trend.isUp ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                    )}>
                        {trend.isUp ? '+' : '-'}{trend.value}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
            </div>
        </div>
    );
}
