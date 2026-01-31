import { NextResponse } from 'next/server';
import * as jose from 'jose';
import { cookies } from 'next/headers';

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

        return NextResponse.json({
            success: true,
            user: { userId: payload.userId, username: payload.username }
        });

    } catch (error) {
        return NextResponse.json({ success: false, user: null });
    }
}
