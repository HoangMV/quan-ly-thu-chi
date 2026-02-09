import { NextResponse } from 'next/server';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'mat_khau_bi_mat_cua_toi');

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token');

        if (!token) {
            return NextResponse.json({ success: false, user: null });
        }

        // Xác thực token
        const { payload } = await jose.jwtVerify(token.value, JWT_SECRET);

        await dbConnect();
        const user = await User.findById(payload.userId).select('-mat_khau');

        if (!user) {
            return NextResponse.json({ success: false, user: null });
        }

        return NextResponse.json({
            success: true,
            user: {
                _id: user._id,
                ten_dang_nhap: user.ten_dang_nhap,
                ho_ten: user.ho_ten,
                email: user.email,
                so_dien_thoai: user.so_dien_thoai,
                anh_dai_dien: user.anh_dai_dien,
                vai_tro: user.vai_tro
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, user: null });
    }
}
