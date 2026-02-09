'use client';

import {
    User,
    Bell,
    Palette,
    Shield,
    Smartphone,
    Globe,
    Circle,
    CheckCircle2,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('interface');
    const { theme, setTheme, primaryColor, setPrimaryColor, font, setFont } = useTheme();

    const tabs = [
        { id: 'profile', label: 'Hồ sơ', icon: User },
        { id: 'interface', label: 'Giao diện', icon: Palette },
        { id: 'notifications', label: 'Thông báo', icon: Bell },
        { id: 'security', label: 'Bảo mật', icon: Shield },
        { id: 'devices', label: 'Thiết bị', icon: Smartphone },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Cài đặt hệ thống</h1>
                <p className="text-slate-500 mt-1 font-medium">Quản lý tùy chỉnh cá nhân và cấu hình ứng dụng.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Tabs Sidebar */}
                <div className="w-full lg:w-64 shrink-0 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                activeTab === tab.id
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <tab.icon size={20} className={cn(
                                activeTab === tab.id ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                            )} />
                            <span className="font-bold">{tab.label}</span>
                            {activeTab === tab.id && <ChevronRight size={16} className="ml-auto" />}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 space-y-6">
                    {activeTab === 'interface' && (
                        <div className="space-y-6">
                            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Chủ đề ứng dụng</h3>
                                    <p className="text-sm text-slate-500">Tùy chỉnh màu sắc hiển thị của hệ thống.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div
                                        onClick={() => setTheme('light')}
                                        className={cn(
                                            "border-2 rounded-2xl p-4 bg-slate-50 transition-all cursor-pointer group",
                                            theme === 'light' ? "border-primary" : "border-transparent hover:border-slate-200"
                                        )}
                                    >
                                        <div className="w-full h-24 bg-white rounded-lg border border-slate-200 mb-3 overflow-hidden shadow-sm">
                                            <div className="h-4 w-full bg-slate-100 border-b border-slate-200"></div>
                                            <div className="p-3 space-y-2">
                                                <div className="h-2 w-1/2 bg-slate-200 rounded-full"></div>
                                                <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 flex items-center justify-between">
                                            Sáng {theme === 'light' && <CheckCircle2 size={16} className="text-primary" />}
                                        </p>
                                    </div>

                                    <div
                                        onClick={() => setTheme('dark')}
                                        className={cn(
                                            "border-2 rounded-2xl p-4 bg-slate-900 transition-all cursor-pointer group",
                                            theme === 'dark' ? "border-primary" : "border-transparent hover:border-slate-700"
                                        )}
                                    >
                                        <div className="w-full h-24 bg-slate-800 rounded-lg border border-slate-700 mb-3 overflow-hidden shadow-sm">
                                            <div className="h-4 w-full bg-slate-700"></div>
                                            <div className="p-3 space-y-2">
                                                <div className="h-2 w-1/2 bg-slate-600 rounded-full"></div>
                                                <div className="h-2 w-full bg-slate-700 rounded-full"></div>
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-slate-400 group-hover:text-white flex items-center justify-between">
                                            Tối {theme === 'dark' && <CheckCircle2 size={16} className="text-primary" />}
                                        </p>
                                    </div>

                                    <div
                                        onClick={() => setTheme('system')}
                                        className={cn(
                                            "border-2 rounded-2xl p-4 bg-linear-to-br from-slate-100 to-slate-800 transition-all cursor-pointer group",
                                            theme === 'system' ? "border-primary" : "border-transparent hover:border-slate-300"
                                        )}
                                    >
                                        <div className="w-full h-24 bg-white rounded-lg border border-slate-200 mb-3 overflow-hidden relative shadow-sm">
                                            <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px]"></div>
                                            <div className="h-4 w-full bg-slate-100 border-b border-slate-200"></div>
                                        </div>
                                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white flex items-center justify-between">
                                            Tự động {theme === 'system' && <CheckCircle2 size={16} className="text-primary" />}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-foreground">Màu chủ đạo</h3>
                                        <p className="text-sm text-slate-500">Chọn màu sắc làm điểm nhấn cho giao diện.</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    {['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#000000'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setPrimaryColor(color)}
                                            className={cn(
                                                "w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 shadow-sm transition-transform hover:scale-110",
                                                primaryColor === color && "ring-2 ring-offset-2 ring-primary"
                                            )}
                                            style={{ backgroundColor: color }}
                                        ></button>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Phông chữ</h3>
                                    <p className="text-sm text-slate-500">Thay đổi kiểu chữ hiển thị trong ứng dụng.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { id: 'font-inter', label: 'Inter', desc: 'Hiện đại & Dễ đọc' },
                                        { id: 'font-roboto', label: 'Roboto', desc: 'Thân thiện & Phổ biến' },
                                        { id: 'font-outfit', label: 'Outfit', desc: 'Sang trọng & Bo tròn' },
                                        { id: 'font-geist', label: 'Geist', desc: 'Tối giản & Kỹ thuật' },
                                    ].map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setFont(f.id as any)}
                                            className={cn(
                                                "flex flex-col items-start p-4 rounded-xl border-2 transition-all group",
                                                f.id,
                                                font === f.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50"
                                            )}
                                        >
                                            <span className="text-lg font-bold text-foreground mb-1">{f.label}</span>
                                            <span className="text-xs text-slate-500">{f.desc}</span>
                                            {font === f.id && (
                                                <CheckCircle2 size={16} className="text-primary mt-2" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Thông báo đẩy</h3>
                                <p className="text-sm text-slate-500">Quản lý cách bạn nhận thông báo qua trình duyệt.</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'notif1', title: 'Giao dịch mới', desc: 'Thông báo khi có giao dịch thu/chi được ghi lại.' },
                                    { id: 'notif2', title: 'Nhắc nhở ngân sách', desc: 'Thông báo khi chi tiêu vượt quá 80% ngân sách.' },
                                    { id: 'notif3', title: 'Báo cáo hàng tuần', desc: 'Nhận tóm tắt tài chính vào sáng thứ Hai mỗi tuần.' },
                                    { id: 'notif4', title: 'Cập nhật hệ thống', desc: 'Thông báo về các tính năng mới và bảo trì.' },
                                ].map((notif) => (
                                    <div key={notif.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                        <div>
                                            <p className="font-bold text-slate-900">{notif.title}</p>
                                            <p className="text-sm text-slate-500">{notif.desc}</p>
                                        </div>
                                        <button className="w-12 h-6 bg-indigo-600 rounded-full relative transition-colors shadow-inner shadow-indigo-100">
                                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md"></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ... Other tabs placeholders ... */}
                    {activeTab !== 'interface' && activeTab !== 'notifications' && (
                        <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center space-y-4">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                                <Construction size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Tính năng đang xây dựng</h3>
                            <p className="text-slate-500">Chúng tôi đang hoàn thiện phần cài đặt này.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Construction({ size }: { size: number }) {
    return <Circle size={size} strokeDasharray="4 4" />;
}
