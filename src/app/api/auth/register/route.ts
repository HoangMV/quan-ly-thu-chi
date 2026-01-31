import dbConnect from '@/lib/db';
import User from '@/models/User';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ success: false, error: 'Vui lòng nhập đầy đủ tên và mật khẩu' }, { status: 400 });
        }

        // Kiểm tra xem username đã tồn tại chưa
        const userExists = await User.findOne({ username });
        if (userExists) {
            return NextResponse.json({ success: false, error: 'Tên đăng nhập đã tồn tại' }, { status: 400 });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // const hashedPassword = password; // Đã xóa debug

        // Tạo user mới
        const user = await User.create({
            username,
            password: hashedPassword
        });

        console.log("Tạo user thành công:", user._id);

        // Trả về thành công
        return NextResponse.json({
            success: true,
            message: 'Đăng ký thành công',
            user: { _id: user._id, username: user.username }
        }, { status: 201 });

    } catch (error) {
        console.error("LỖI ĐĂNG KÝ CHI TIẾT:", error);
        return NextResponse.json({
            success: false,
            error: 'Lỗi server: ' + (error instanceof Error ? error.message : String(error))
        }, { status: 500 });
    }
}
