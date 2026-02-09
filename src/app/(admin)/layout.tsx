'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useRef } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import AdminHeader from '@/components/layout/AdminHeader';
import { SidebarProvider, useSidebar } from '@/lib/sidebar-context';
import { cn } from '@/lib/utils';

interface UserType {
    _id: string;
    ten_dang_nhap: string;
    ho_ten: string;
    anh_dai_dien?: string;
    email?: string;
}

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { isOpen, isCollapsed, close } = useSidebar();
    const mainRef = useRef<HTMLElement>(null);

    // Scroll to top when pathname changes
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTop = 0;
        }
    }, [pathname]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data.success && data.user) {
                    setUser(data.user);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="h-screen bg-background text-foreground flex overflow-hidden">
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={close}
                />
            )}

            {/* Sidebar - Mobile & Desktop */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-y-0 lg:flex lg:h-full shrink-0",
                isOpen ? "translate-x-0" : "-translate-x-full",
                isCollapsed ? "w-20" : "w-64"
            )}>
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
                <AdminHeader
                    ten_dang_nhap={user.ten_dang_nhap}
                    ho_ten={user.ho_ten}
                    anh_dai_dien={user.anh_dai_dien}
                />

                <main
                    ref={mainRef}
                    className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 scroll-smooth"
                >
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <footer className="py-4 px-8 border-t border-border bg-card/50 text-center shrink-0">
                    <p className="text-xs text-slate-400 font-medium">
                        &copy; {new Date().getFullYear()} FinTrack - Hệ quản trị tài chính cá nhân chuyên nghiệp.
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AdminLayoutInner>{children}</AdminLayoutInner>
        </SidebarProvider>
    );
}
