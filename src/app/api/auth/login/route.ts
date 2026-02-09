import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fintrack_secret_default');

export async function POST(req: Request) {
    try {
        await dbConnect();

        const { ten_dang_nhap, mat_khau } = await req.json();

        // Tìm user trong database
        const user: any = await User.findOne({ ten_dang_nhap }).select('+mat_khau');

        if (!user) {
            return NextResponse.json({ success: false, error: 'Tên đăng nhập không tồn tại' }, { status: 400 });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: 'Mật khẩu không chính xác' }, { status: 400 });
        }

        // Tạo token đăng nhập (JWT)
        const token = await new jose.SignJWT({
            userId: user._id.toString(),
            ten_dang_nhap: user.ten_dang_nhap,
            ho_ten: user.ho_ten,
            vai_tro: user.vai_tro
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(JWT_SECRET);

        // Lưu token vào Cookie
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        });

        return NextResponse.json({
            success: true,
            message: 'Đăng nhập thành công',
            user: {
                _id: user._id,
                ten_dang_nhap: user.ten_dang_nhap,
                ho_ten: user.ho_ten,
                anh_dai_dien: user.anh_dai_dien
            }
        });

    } catch (error) {
        console.error('❌ Lỗi đăng nhập:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ'
        }, { status: 500 });
    }
}
