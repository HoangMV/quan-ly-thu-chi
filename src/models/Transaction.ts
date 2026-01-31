import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITransaction extends Document {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    spender?: string;
    category?: string;
    userId: mongoose.Types.ObjectId;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        spender: { type: String },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: true,
        },
        category: { type: String, default: 'Chung' },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Transaction: Model<ITransaction> =
    mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default Transaction;
