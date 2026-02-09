import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { ten_dang_nhap, mat_khau, ho_ten } = await req.json();

        if (!ten_dang_nhap || !mat_khau || !ho_ten) {
            return NextResponse.json({ success: false, error: 'Vui lòng nhập đầy đủ thông tin bắt buộc' }, { status: 400 });
        }

        // Kiểm tra xem user đã tồn tại chưa
        const userExists = await User.findOne({ ten_dang_nhap });
        if (userExists) {
            return NextResponse.json({ success: false, error: 'Tên đăng nhập đã tồn tại' }, { status: 400 });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mat_khau, salt);

        // Tạo user mới
        const user = await User.create({
            ten_dang_nhap,
            mat_khau: hashedPassword,
            ho_ten
        });

        return NextResponse.json({
            success: true,
            message: 'Đăng ký tài khoản thành công',
            user: {
                _id: user._id,
                ten_dang_nhap: user.ten_dang_nhap,
                ho_ten: user.ho_ten
            }
        }, { status: 201 });

    } catch (error) {
        console.error("❌ Lỗi đăng ký:", error);
        return NextResponse.json({
            success: false,
            error: 'Lỗi server: ' + (error instanceof Error ? error.message : String(error))
        }, { status: 500 });
    }
}
