'use client';

import Link from 'next/link';
import {
  Wallet,
  ArrowLeftRight,
  PieChart,
  UserCircle2,
  Settings,
  ArrowRight,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) setUser(data.user);
      });
  }, []);

  const menuCards = [
    {
      title: 'Quản lý Thu Chi',
      desc: 'Theo dõi chi tiết các khoản thu nhập và chi tiêu của bạn.',
      icon: ArrowLeftRight,
      href: '/transactions',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-500',
      bgLight: 'bg-emerald-50 dark:bg-emerald-900/10'
    },
    {
      title: 'Ngân sách',
      desc: 'Thiết lập giới hạn chi tiêu và kế hoạch tiết kiệm.',
      icon: PieChart,
      href: '/budget',
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      bgLight: 'bg-blue-50 dark:bg-blue-900/10'
    },
    {
      title: 'Tài khoản',
      desc: 'Quản lý số dư các ví và tài khoản ngân hàng.',
      icon: Wallet,
      href: '/accounts',
      color: 'bg-violet-500',
      textColor: 'text-violet-500',
      bgLight: 'bg-violet-50 dark:bg-violet-900/10'
    },
    {
      title: 'Hồ sơ cá nhân',
      desc: 'Cập nhật thông tin tài khoản và bảo mật.',
      icon: UserCircle2,
      href: '/profile',
      color: 'bg-orange-500',
      textColor: 'text-orange-500',
      bgLight: 'bg-orange-50 dark:bg-orange-900/10'
    },
    {
      title: 'Cài đặt hệ thống',
      desc: 'Tùy chỉnh giao diện và các thiết lập khác.',
      icon: Settings,
      href: '/settings',
      color: 'bg-slate-500',
      textColor: 'text-slate-500',
      bgLight: 'bg-slate-50 dark:bg-slate-900/10'
    }
  ];

  if (user?.vai_tro === 'admin') {
    menuCards.push({
      title: 'Quản lý người dùng',
      desc: 'Thêm, xóa và phân quyền thành viên hệ thống.',
      icon: Users,
      href: '/users',
      color: 'bg-rose-500',
      textColor: 'text-rose-500',
      bgLight: 'bg-rose-50 dark:bg-rose-900/10'
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Trang chủ</h1>
        <p className="text-slate-500 font-medium italic">Chọn một chức năng để bắt đầu quản lý tài chính.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuCards.map((card, idx) => (
          <Link
            key={idx}
            href={card.href}
            className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] opacity-10 transition-transform group-hover:scale-150 duration-500", card.color)} />

            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300", card.bgLight, card.textColor)}>
              <card.icon size={28} strokeWidth={2.5} />
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">{card.title}</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">{card.desc}</p>

            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-primary transition-colors">
              Truy cập <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
