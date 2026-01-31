import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { NextResponse } from 'next/server';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Type for Next.js 15
) {
    await dbConnect();
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        const deletedTransaction = await Transaction.findByIdAndDelete(id);

        if (!deletedTransaction) {
            return NextResponse.json({ success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: deletedTransaction });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    try {
        const { id } = await params;
        const body = await req.json();

        const transaction = await Transaction.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!transaction) {
            return NextResponse.json({ success: false }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: transaction });
    } catch (error) {
        return NextResponse.json({ success: false, error: error }, { status: 400 });
    }
}
