import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, User, Settings, LogOut, Shield, ChevronDown, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/lib/sidebar-context';

interface AdminHeaderProps {
    ten_dang_nhap?: string;
    ho_ten?: string;
    anh_dai_dien?: string;
}

export default function AdminHeader({
    ten_dang_nhap = 'user',
    ho_ten = 'Người dùng',
    anh_dai_dien = ''
}: AdminHeaderProps) {
    const { toggle } = useSidebar();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40 px-6 shrink-0">
            <div className="h-full flex items-center justify-between max-w-7xl mx-auto w-full">
                {/* Mobile Toggle */}
                <button
                    onClick={toggle}
                    className="lg:hidden p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors mr-2 text-primary"
                >
                    <Menu size={24} />
                </button>

                {/* Search */}
                <div className="flex-1 max-w-md hidden md:block">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm giao dịch, báo cáo..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm dark:text-white"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className={cn(
                                "p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg relative transition-colors",
                                showNotifications && "bg-slate-100 dark:bg-slate-700 text-primary"
                            )}
                        >
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Thông báo</h3>
                                    <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Đã xem hết</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    <div className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b border-slate-50 dark:border-slate-800">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Chi tiêu mới</p>
                                        <p className="text-xs text-slate-500">Bạn vừa thêm chi tiêu 230.000 đ vào "Chung"</p>
                                        <p className="text-[10px] text-slate-400 mt-1">2 phút trước</p>
                                    </div>
                                </div>
                                <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                                    <button className="w-full py-2 text-center text-xs font-bold text-slate-500 hover:text-primary transition-colors">
                                        Xem tất cả thông báo
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className={cn(
                                "flex items-center gap-2 p-1 pl-2 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-slate-800 group",
                                showUserMenu && "bg-slate-100 dark:bg-slate-700"
                            )}
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none truncate max-w-[120px]">{ho_ten}</p>
                                <p className="text-[10px] text-slate-500 mt-1 font-medium">Thành viên Pro</p>
                            </div>
                            <div className="w-9 h-9 bg-linear-to-tr from-primary to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm relative group-hover:shadow-primary/20 transition-all uppercase text-sm overflow-hidden">
                                {anh_dai_dien ? (
                                    <img src={anh_dai_dien} alt={ho_ten} className="w-full h-full object-cover" />
                                ) : (
                                    ho_ten.charAt(0)
                                )}
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                            </div>
                            <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-200", showUserMenu && "rotate-180")} />
                        </button>

                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex gap-3 items-center">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden">
                                        {anh_dai_dien ? (
                                            <img src={anh_dai_dien} alt={ho_ten} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={20} />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black text-slate-900 dark:text-white truncate">{ho_ten}</p>
                                        <p className="text-[10px] text-slate-500 truncate mt-0.5">@{ten_dang_nhap}</p>
                                    </div>
                                </div>

                                <div className="p-1.5">
                                    <Link href="/profile" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary rounded-xl transition-all group">
                                        <UserCircle2 size={18} className="text-slate-400 group-hover:text-primary" />
                                        <span className="font-bold">Hồ sơ cá nhân</span>
                                    </Link>
                                    <Link href="/settings?tab=security" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary rounded-xl transition-all group">
                                        <Shield size={18} className="text-slate-400 group-hover:text-primary" />
                                        <span className="font-bold">Bảo mật & Mã khóa</span>
                                    </Link>
                                    <Link href="/settings?tab=interface" className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary rounded-xl transition-all group">
                                        <Settings size={18} className="text-slate-400 group-hover:text-primary" />
                                        <span className="font-bold">Cài đặt giao diện</span>
                                    </Link>
                                </div>

                                <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all group"
                                    >
                                        <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                        <span className="font-bold uppercase tracking-wider text-xs">Đăng xuất</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
