import { Users, UserCheck, UserX } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

interface UsersStatsProps {
    stats: {
        total: number;
        active: number;
        inactive: number;
    };
}

export default function UsersStats({ stats }: UsersStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <StatCard
                label="Tổng thành viên"
                value={stats.total}
                icon={Users}
                variant="primary"
            />
            <StatCard
                label="Đang hoạt động"
                value={stats.active}
                icon={UserCheck}
                variant="green"
            />
            <StatCard
                label="Đã bị khóa"
                value={stats.inactive}
                icon={UserX}
                variant="red"
            />
        </div>
    );
}
