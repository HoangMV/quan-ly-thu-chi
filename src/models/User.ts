import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Vui lòng nhập tên đăng nhập'],
            unique: true,
            minlength: [3, 'Tên đăng nhập phải có ít nhất 3 ký tự']
        },
        password: {
            type: String,
            required: [true, 'Vui lòng nhập mật khẩu'],
            minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
            select: false // Mặc định không trả về password khi truy vấn để bảo mật
        },
    },
    { timestamps: true }
);

// Check if the model is already defined to prevent overwriting during hot reloads
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
