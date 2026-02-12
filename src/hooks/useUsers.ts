import { useState, useCallback, useMemo, useEffect } from 'react';

export interface UserData {
    _id: string;
    ten_dang_nhap: string;
    ho_ten: string;
    email?: string;
    so_dien_thoai?: string;
    anh_dai_dien?: string;
    vai_tro: 'admin' | 'user';
    trang_thai: 'active' | 'inactive';
    createdAt: string;
}

export function useUsers() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.success) {
                setUsers(data.users);
                setError('');
            } else {
                setError(data.error || 'Bạn không có quyền truy cập');
            }
        } catch (err) {
            setError('Lỗi kết nối máy chủ');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const addUser = async (formData: any) => {
        const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Lỗi khi thêm người dùng');
        }
        await fetchUsers();
        return data;
    };

    const updateUser = async (formData: any) => {
        const res = await fetch('/api/admin/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.error || 'Lỗi khi cập nhật người dùng');
        }
        await fetchUsers();
        return data;
    };

    const deleteUser = async (userId: string) => {
        const res = await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
        if (res.ok) {
            await fetchUsers();
        } else {
            const data = await res.json();
            throw new Error(data.error || 'Lỗi khi xóa');
        }
    };

    const toggleStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        const res = await fetch('/api/admin/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, trang_thai: newStatus }),
        });
        if (res.ok) {
            await fetchUsers();
        }
    };

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lowerTerm = searchTerm.toLowerCase();
        return users.filter(u =>
            u.ho_ten.toLowerCase().includes(lowerTerm) ||
            u.ten_dang_nhap.toLowerCase().includes(lowerTerm) ||
            (u.email && u.email.toLowerCase().includes(lowerTerm))
        );
    }, [users, searchTerm]);

    const stats = useMemo(() => ({
        total: users.length,
        active: users.filter(u => u.trang_thai === 'active').length,
        inactive: users.filter(u => u.trang_thai === 'inactive').length,
    }), [users]);

    return {
        users,
        filteredUsers,
        stats,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        fetchUsers,
        addUser,
        updateUser,
        deleteUser,
        toggleStatus,
    };
}
