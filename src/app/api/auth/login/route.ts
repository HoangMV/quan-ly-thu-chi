import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { cookies } from 'next/headers';

// Key bí mật dùng để mã hóa token (trong thực tế nên lưu trong .env)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'mat_khau_bi_mat_cua_toi');

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, password } = await req.json();

        // Tìm user trong database (lấy cả password để so sánh)
        const user: any = await User.findOne({ username }).select('+password');

        if (!user) {
            return NextResponse.json({ success: false, error: 'Tên đăng nhập không tồn tại' }, { status: 400 });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: 'Mật khẩu sai' }, { status: 400 });
        }

        // Tạo token đăng nhập (JWT)
        // QUAN TRỌNG: Phải convert _id sang string để tránh lỗi Buffer khi decode
        const token = await new jose.SignJWT({ userId: user._id.toString(), username: user.username })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d') // Token hết hạn sau 7 ngày
            .sign(JWT_SECRET);

        // Lưu token vào Cookie của trình duyệt (HttpOnly để bảo mật)
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 7 ngày
        });

        return NextResponse.json({
            success: true,
            message: 'Đăng nhập thành công',
            user: { _id: user._id, username: user.username }
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Lỗi đăng nhập' }, { status: 500 });
    }
}
