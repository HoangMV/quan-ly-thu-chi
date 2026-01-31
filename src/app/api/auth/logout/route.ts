import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token'); // Xóa cookie đăng nhập
    return NextResponse.json({ success: true, message: 'Đăng xuất thành công' });
}
