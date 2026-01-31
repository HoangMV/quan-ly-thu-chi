require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

console.log('Đang thử kết nối với chuỗi:', uri.replace(/:([^:@]+)@/, ':****@')); // Ẩn mật khẩu khi in ra

async function testConnection() {
    try {
        await mongoose.connect(uri);
        console.log('✅ KẾT NỐI THÀNH CÔNG! (Thông tin trong file .env.local CÓ VẺ đúng)');
        console.log('Database Name:', mongoose.connection.name);
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ KẾT NỐI THẤT BẠI!');
        console.error('Lỗi chi tiết:', error.message);
        if (error.codeName === 'AtlasError') {
            console.log('\n--- GỢI Ý SỬA LỖI ---');
            console.log('1. Kiểm tra lại USERNAME và PASSWORD trong Database Access trên MongoDB Atlas.');
            console.log('   (Lưu ý: User này KHÁC với tài khoản đăng nhập vào web MongoDB)');
            console.log('2. Đảm bảo mật khẩu không chứa ký tự đặc biệt như @, :, / (nếu có phải mã hóa URL).');
            console.log('3. Kiểm tra lại IP Whitelist trong Network Access (phải là 0.0.0.0/0 để cho phép tất cả).');
        }
    }
}

testConnection();
