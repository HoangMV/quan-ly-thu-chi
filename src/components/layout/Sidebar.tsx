'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    Settings,
    PieChart,
    LogOut,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
    UserCircle2,
    Users,
    ArrowLeftRight,
    Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/lib/sidebar-context';
import { useState, useEffect } from 'react';

const menuItems = [
    { icon: Home, label: 'Trang chủ', href: '/' },
    { icon: ArrowLeftRight, label: 'Quản lý thu chi', href: '/transactions' },
    { icon: PieChart, label: 'Ngân sách', href: '/budget' },
    { icon: Wallet, label: 'Tài khoản', href: '/accounts' },
    { icon: UserCircle2, label: 'Hồ sơ cá nhân', href: '/profile' },
    { icon: Users, label: 'Quản lý người dùng', href: '/users', adminOnly: true },
    { icon: Settings, label: 'Cài đặt hệ thống', href: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleCollapse } = useSidebar();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.json())
            .then(data => {
                if (data.success) setUser(data.user);
            });
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const filteredMenuItems = menuItems.filter(item => {
        if (item.adminOnly && user?.vai_tro !== 'admin') return false;
        return true;
    });

    return (
        <aside className={cn(
            "h-full bg-white dark:bg-[#0F172A] border-r border-slate-100 dark:border-slate-800 flex flex-col transition-all duration-500 ease-in-out relative z-50",
            isCollapsed ? "w-20" : "w-64"
        )}>
            {/* Smooth Toggle Button */}
            <button
                onClick={toggleCollapse}
                className="hidden lg:flex absolute -right-3 top-10 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-primary shadow-[0_4px_10px_rgba(0,0,0,0.05)] z-60 transition-all hover:scale-110 active:scale-90"
            >
                {isCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
            </button>

            <div className={cn("p-6 mb-4 transition-all duration-500", isCollapsed ? "px-4" : "px-6")}>
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-linear-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 shrink-0 transition-transform duration-500 group-hover:rotate-12">
                        <Wallet size={24} strokeWidth={2.5} />
                    </div>
                    {!isCollapsed && (
                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter truncate animate-in fade-in slide-in-from-left-4 duration-500 italic group-hover:text-primary transition-colors">
                            FINTRACK
                        </span>
                    )}
                </Link>
            </div>

            <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-hide">
                {filteredMenuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            title={isCollapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center group px-3.5 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-[0_4px_12px_rgba(var(--primary-rgb),0.1)]"
                                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white",
                                isCollapsed && "justify-center"
                            )}
                        >
                            {/* Active Indicator Bar */}
                            {isActive && !isCollapsed && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-full animate-in zoom-in duration-300"></div>
                            )}

                            <div className="flex items-center gap-3.5 relative z-10 w-full">
                                <item.icon size={20} className={cn(
                                    "transition-all duration-300 shrink-0",
                                    isActive ? "text-primary scale-110" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:scale-110"
                                )} strokeWidth={isActive ? 2.5 : 2} />

                                <span className={cn(
                                    "font-bold text-sm tracking-tight transition-all duration-500 whitespace-nowrap",
                                    isCollapsed ? "opacity-0 invisible w-0 -translate-x-4" : "opacity-100 visible translate-x-0",
                                    isActive ? "text-primary" : "text-slate-600 dark:text-slate-400"
                                )}>
                                    {item.label}
                                </span>

                                {!isCollapsed && isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className={cn("p-4 border-t border-slate-100 dark:border-slate-800 transition-all duration-500", isCollapsed && "flex justify-center")}>
                <button
                    onClick={handleLogout}
                    title={isCollapsed ? "Đăng xuất" : undefined}
                    className={cn(
                        "flex items-center gap-3.5 px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-2xl transition-all duration-300 group w-full",
                        isCollapsed && "justify-center p-0 h-11 w-11"
                    )}
                >
                    <LogOut size={20} className="text-slate-400 group-hover:text-rose-500 shrink-0 transition-transform group-hover:translate-x-1" />
                    {!isCollapsed && <span className="font-bold text-sm tracking-tight">Đăng xuất</span>}
                </button>
            </div>
        </aside>
    );
}
