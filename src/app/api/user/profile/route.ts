import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'mat_khau_bi_mat_cua_toi');

async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    if (!token) return null;
    try {
        const { payload } = await jose.jwtVerify(token.value, JWT_SECRET);
        return String(payload.userId);
    } catch (e) {
        return null;
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const userId = await getCurrentUser();

        if (!userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // Chỉ cho phép cập nhật một số trường nhất định
        const updates = {
            ho_ten: body.ho_ten,
            email: body.email,
            so_dien_thoai: body.so_dien_thoai,
            anh_dai_dien: body.anh_dai_dien
        };

        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-mat_khau');

        if (!user) {
            return NextResponse.json({ success: false, error: 'Người dùng không tồn tại' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Cập nhật hồ sơ thành công',
            user
        });

    } catch (error) {
        console.error('❌ Lỗi cập nhật hồ sơ:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Lỗi máy chủ'
        }, { status: 500 });
    }
}
