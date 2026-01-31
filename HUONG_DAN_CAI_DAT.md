# HƯỚNG DẪN XÂY DỰNG DỰ ÁN NEXT.JS FULL-STACK (TỪ A-Z)

Tài liệu này tổng hợp toàn bộ các câu lệnh và quy trình để xây dựng một dự án quản lý (như Quản Lý Thu Chi) sử dụng Next.js, MongoDB và xác thực người dùng.

---

## PHẦN 1: KHỞI TẠO DỰ ÁN MỚI

### Bước 1: Tạo khung dự án
Mở Terminal (cmd/powershell) tại thư mục muốn chứa code:

```bash
# Thay 'ten-du-an-moi' bằng tên dự án của bạn
npx create-next-app@latest ten-du-an-moi
```

**Lưu ý chọn config:**
- Would you like to use TypeScript? **Yes**
- Would you like to use ESLint? **Yes**
- Would you like to use Tailwind CSS? **Yes**
- Would you like to use `src/` directory? **Yes**
- Would you like to use App Router? **Yes**
- Would you like to customize the default import alias? **No**

### Bước 2: Đi vào thư mục dự án
```bash
cd ten-du-an-moi
```

### Bước 3: Cài đặt thư viện cần thiết
Copy và chạy lần lượt các lệnh sau:

```bash
# 1. Database & Tiện ích giao diện
npm install mongoose lucide-react clsx tailwind-merge

# 2. Bảo mật (Mật khẩu & Đăng nhập)
npm install bcryptjs jose

# 3. Hỗ trợ TypeScript
npm install -D @types/bcryptjs
```

### Bước 4: Chạy thử trên máy
```bash
npm run dev
```
Truy cập: `http://localhost:3000`

---

## PHẦN 2: CẤU HÌNH DATABASE (MONGODB)

### 1. File biến môi trường (.env.local)
Tạo file tên là `.env.local` ở thư mục gốc dự án (ngang hàng với `package.json`).
Nội dung file:

```env
# Thay đường dẫn bên dưới bằng link MongoDB Atlas của bạn
MONGODB_URI=mongodb+srv://admin:matkhau@cluster0.xxxxx.mongodb.net/ten-database
JWT_SECRET=mot_chuoi_ky_tu_bi_mat_bat_ky_dai_dai
```

### 2. Cấu trúc folder chuẩn (trong src/)
- `src/lib/db.ts`: Code kết nối Database.
- `src/models/`: Chứa các file định nghĩa dữ liệu (như User.ts, Transaction.ts).
- `src/app/api/`: Chứa các file xử lý Backend (route.ts).
- `src/components/`: Chứa giao diện (Frontend).

---

## PHẦN 3: ĐẨY CODE LÊN GITHUB & DEPLOY

### Bước 1: Lưu code trên máy (Commit)
Mỗi khi code xong một tính năng, chạy 3 lệnh này:

```bash
git add .
git commit -m "Ghi chú về những gì đã sửa"
# Nếu là lần đầu tiên đẩy, dùng lệnh: git push -u origin main
# Những lần sau chỉ cần:
git push
```

### Bước 2: Kết nối GitHub lần đầu
(Chỉ làm 1 lần duy nhất lúc mới tạo dự án)

1. Lên [GitHub.com](https://github.com/new) tạo Repository mới.
2. Copy link repo (dạng `https://github.com/...git`).
3. Chạy lệnh:

```bash
git branch -M main
git remote add origin ĐƯỜNG_LINK_REPO_CỦA_BẠN
git push -u origin main
```

---

## PHẦN 4: DEPLOY LÊN VERCEL (Chạy Online)

1. Đăng nhập [Vercel.com](https://vercel.com) bằng GitHub.
2. Chọn "Add New Project" -> Import dự án vừa tạo.
3. **QUAN TRỌNG:** Vào mục **Environment Variables**, thêm 2 biến giống hệt file `.env.local`:
   - `MONGODB_URI`
   - `JWT_SECRET`
4. Bấm **Deploy**.

## LƯU Ý KHI SỬ DỤNG MONGODB ATLAS
Vào mục **Network Access** trên MongoDB Atlas, đảm bảo đã thêm IP `0.0.0.0/0` (Allow Access from Anywhere) để Vercel có thể kết nối được.
