import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

async function checkAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');

    if (!token) return { isAuthorized: false };

    try {
        const { payload } = await jose.jwtVerify(token.value, JWT_SECRET);
        await dbConnect();
        const currentUser = await User.findById(payload.userId);
        if (!currentUser || currentUser.vai_tro !== 'admin') return { isAuthorized: false };
        return { isAuthorized: true, userId: payload.userId };
    } catch (e) {
        return { isAuthorized: false };
    }
}

export async function GET() {
    const { isAuthorized } = await checkAdmin();
    if (!isAuthorized) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, users });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { isAuthorized } = await checkAdmin();
    if (!isAuthorized) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { ten_dang_nhap, mat_khau, ho_ten, vai_tro, email, so_dien_thoai } = body;

        if (!ten_dang_nhap || !mat_khau || !ho_ten) {
            return NextResponse.json({ success: false, error: 'Thiếu thông tin bắt buộc' }, { status: 400 });
        }

        const userExists = await User.findOne({ ten_dang_nhap });
        if (userExists) return NextResponse.json({ success: false, error: 'Tên đăng nhập đã tồn tại' }, { status: 400 });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mat_khau, salt);

        const newUser = await User.create({
            ten_dang_nhap,
            mat_khau: hashedPassword,
            ho_ten,
            vai_tro: vai_tro || 'user',
            email,
            so_dien_thoai,
            trang_thai: 'active'
        });

        return NextResponse.json({ success: true, user: newUser });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const { isAuthorized } = await checkAdmin();
    if (!isAuthorized) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    try {
        const { userId, ...updateData } = await req.json();

        const permittedFields = ['ho_ten', 'email', 'so_dien_thoai', 'vai_tro', 'trang_thai', 'mat_khau'];
        const dataToUpdate: any = {};

        for (const field of permittedFields) {
            if (updateData[field] !== undefined && updateData[field] !== '') {
                if (field === 'mat_khau') {
                    const salt = await bcrypt.genSalt(10);
                    dataToUpdate['mat_khau'] = await bcrypt.hash(updateData[field], salt);
                } else {
                    dataToUpdate[field] = updateData[field];
                }
            }
        }

        const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, { new: true });
        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { isAuthorized, userId: currentUserId } = await checkAdmin();
    if (!isAuthorized) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('id');

        if (!userId) return NextResponse.json({ success: false, error: 'Missing ID' }, { status: 400 });
        if (userId === currentUserId) return NextResponse.json({ success: false, error: 'Cannot delete yourself' }, { status: 400 });

        await User.findByIdAndDelete(userId);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
