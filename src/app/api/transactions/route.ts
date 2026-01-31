import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import mongoose from 'mongoose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'mat_khau_bi_mat_cua_toi');

// Hàm helper để xác thực user
async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token');
    if (!token) return null;
    try {
        const { payload } = await jose.jwtVerify(token.value, JWT_SECRET);
        console.log("DEBUG RAW PAYLOAD:", payload);

        // Xử lý nếu userId là object dạng Buffer (do MongoDB ObjectId gây ra)
        let userIdStr = payload.userId;
        if (typeof userIdStr === 'object' && userIdStr !== null) {
            // Thử convert về string nếu có thể, hoặc lấy id từ db check lại
            // Cách nhanh nhất: ép kiểu string nếu nó là ObjectId dạng User
            userIdStr = String(userIdStr);

            // Nếu là dạng { buffer: ... } thì toHexString có thể cần thiết nhưng
            // thường Mongoose objectId toString() là đủ.
        }

        return String(userIdStr); // Đảm bảo trả về chuỗi
    } catch (e) {
        console.error("JWT Verify Error:", e);
        return null;
    }
}

export async function GET() {
    await dbConnect();
    const userId = await getCurrentUser();

    console.log("DEBUG: Current User ID loading data:", userId);

    if (!userId) {
        console.log("DEBUG: No User ID found -> Unauthorized");
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Ép kiểu userId sang ObjectId để MongoDB hiểu chắc chắn
        const objectId = new mongoose.Types.ObjectId(userId);

        // Chỉ tìm những giao dịch của user hiện tại (userId match)
        const transactions = await Transaction.find({ userId: objectId }).sort({ date: -1 });
        return NextResponse.json({ success: true, data: transactions });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
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
        // Tự động gán userId vào bản ghi mới
        const transaction = await Transaction.create({ ...body, userId });
        return NextResponse.json({ success: true, data: transaction }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
