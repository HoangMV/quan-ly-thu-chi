import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    ten_dang_nhap: string;
    mat_khau?: string;
    ho_ten: string;
    email?: string;
    so_dien_thoai?: string;
    anh_dai_dien?: string;
    vai_tro: 'admin' | 'user';
    trang_thai: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        ten_dang_nhap: {
            type: String,
            required: [true, 'Vui lòng nhập tên đăng nhập'],
            unique: true,
            trim: true,
            minlength: [3, 'Tên đăng nhập phải có ít nhất 3 ký tự']
        },
        mat_khau: {
            type: String,
            required: [true, 'Vui lòng nhập mật khẩu'],
            minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
            select: false
        },
        ho_ten: {
            type: String,
            required: [true, 'Vui lòng nhập họ và tên'],
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
            unique: true
        },
        so_dien_thoai: {
            type: String,
            trim: true
        },
        anh_dai_dien: {
            type: String,
            default: ''
        },
        vai_tro: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
        trang_thai: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        }
    },
    {
        timestamps: true,
        collection: 'users' // Explicit collection name
    }
);

// Check if the model is already defined to prevent overwriting during hot reloads
// In development, if you change the schema, you might need to restart the server 
// or use this check to clear the cache.
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.User;
}

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
