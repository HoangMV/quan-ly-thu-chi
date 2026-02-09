import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import mongoose from 'mongoose';

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

export async function GET() {
    await dbConnect();
    const userId = await getCurrentUser();

    if (!userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const objectId = new mongoose.Types.ObjectId(userId);
        const transactions = await Transaction.find({ ma_nguoi_dung: objectId }).sort({ ngay_thang: -1 });
        return NextResponse.json({ success: true, data: transactions });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Lỗi khi tải dữ liệu' }, { status: 400 });
    }
}

export async function POST(req: Request) {
    await dbConnect();
    const userId = await getCurrentUser();

    if (!userId) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const transaction = await Transaction.create({
            ...body,
            ma_nguoi_dung: new mongoose.Types.ObjectId(userId)
        });
        return NextResponse.json({ success: true, data: transaction }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Lỗi khi tạo giao dịch' }, { status: 400 });
    }
}
