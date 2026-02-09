import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
    ma_nguoi_dung: mongoose.Types.ObjectId;
    mo_ta: string;
    so_tien: number;
    loai: 'income' | 'expense';
    nguoi_chi?: string;
    danh_muc?: string;
    ngay_thang: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
    {
        ma_nguoi_dung: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        mo_ta: { type: String, required: true },
        so_tien: { type: Number, required: true },
        nguoi_chi: { type: String },
        loai: {
            type: String,
            enum: ['income', 'expense'],
            required: true,
        },
        danh_muc: { type: String, default: 'Chung' },
        ngay_thang: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
        collection: 'transactions'
    }
);

if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Transaction;
}

const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
