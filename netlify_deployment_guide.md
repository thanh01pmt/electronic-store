# Hướng Dẫn Deploy Lên Netlify (Netlify Deployment Guide)

Tài liệu này hướng dẫn chi tiết cách deploy ứng dụng Next.js Electronic Store lên Netlify cho trang web **https://ele-store.netlify.app**.

---

## 🛠️ Những Việc Đã Hoàn Thành (What We Did)

1. **Cài đặt thư viện thành công**: Đã chạy `npm install` và cài đặt đầy đủ 1103 packages.
2. **Khắc phục lỗi Build khi thiếu biến môi trường**:
   - Next.js phân tích và biên dịch các trang tĩnh lúc build. Khi không có biến môi trường, các API client khởi tạo trực tiếp ở phạm vi toàn cục (global scope) của file route/layout sẽ bị crash.
   - Đã thêm giá trị fallback cho `Resend` (`re_placeholder_for_build`), `MongoClient` (`mongodb://localhost:27017/dummy`), và `metadataBase` (`https://localhost:3000`) để quá trình compile build diễn ra trơn tru.
3. **Cấu hình `netlify.toml`**:
   - Tạo file `netlify.toml` ở thư mục gốc để thiết lập build command (`npm run build`), publish directory (`.next`), và tự động bỏ qua kiểm tra biến môi trường lúc build bằng cách gán `SKIP_ENV_VALIDATION = "true"`.
4. **Kiểm tra Build thành công**: Đã chạy thử nghiệm build thành công cục bộ (Local build validation) với mã thoát `Exit code: 0`.
5. **Cập nhật File cấu hình cục bộ**: Cập nhật biến `NEXT_PUBLIC_APP_URL="https://ele-store.netlify.app"` vào file `.env`.

---

## 📋 Danh Sách Biến Môi Trường Cần Cấu Hình Trên Netlify

Để ứng dụng chạy thực tế (runtime), bạn cần thêm đầy đủ các biến môi trường này vào trang quản trị của Netlify (**Site Settings > Environment Variables**):

| Tên Biến Môi Trường | Mô tả | Giá trị cụ thể / Hướng dẫn |
| :--- | :--- | :--- |
| **`NEXT_PUBLIC_APP_URL`** | URL ứng dụng của bạn trên Netlify | `https://ele-store.netlify.app` |
| **`NODE_ENV`** | Môi trường chạy ứng dụng | `production` |
| **`CLERK_SECRET_KEY`** | Secret key của Clerk Auth | Lấy từ Clerk Dashboard (API Keys) |
| **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`** | Publishable key của Clerk Auth | Lấy từ Clerk Dashboard |
| **`NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`** | Route chuyển hướng sau khi đăng nhập | `/` |
| **`NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`** | Route chuyển hướng sau khi đăng ký | `/` |
| **`MONGODB_URL`** | Connection string đến MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| **`NEXT_PUBLIC_DB_NAME`** | Tên Database sử dụng | Tên database của bạn |
| **`RESEND_API_KEY`** | API Key từ dịch vụ gửi email Resend | `re_...` |
| **`NEXT_PUBLIC_UPDATES_EMAIL_ADDR`** | Email người gửi email thông báo | `Acme <onboarding@resend.dev>` hoặc domain của bạn |
| **`REDIS_URL`** | URL kết nối Serverless Redis Upstash | `redis://...` |
| **`REDIS_TOKEN`** | REST Token kết nối Upstash Redis | Lấy từ Upstash Console |
| **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**| Publishable key của Stripe | Lấy từ Stripe Dashboard |
| **`STRIPE_SECRET_KEY`** | Secret key của Stripe | Lấy từ Stripe Dashboard |
| **`NEXT_PUBLIC_IP_INFO_API_KEY`** | API Key của dịch vụ IP Info | Lấy từ ipinfo.io |
| **`AWS_ACCESS_KEY_ID`** | AWS Access Key cho S3 Storage | Lấy từ AWS IAM |
| **`AWS_SECRET_ACCESS_KEY`** | AWS Secret Key cho S3 Storage | Lấy từ AWS IAM |
| **`AWS_REGION`** | AWS Region chứa S3 bucket | ví dụ: `ap-southeast-1` |
| **`AWS_BUCKET_NAME`** | Tên AWS S3 bucket chứa ảnh sản phẩm | ví dụ: `my-electronic-store-bucket` |

---

## 🚀 Các Bước Deploy Thực Tế (Deployment Steps)

Bạn có hai cách để tiến hành deploy:

### Cách 1: Deploy qua GitHub (Khuyên Dùng - Tự động CI/CD)

1. **Commit và Push các thay đổi lên GitHub**:
   Chạy các lệnh sau trong terminal:
   ```bash
   git add .
   git commit -m "chore: configure project for netlify deployment to ele-store.netlify.app"
   git push origin main
   ```
2. **Import vào Netlify**:
   - Truy cập [Netlify Dashboard](https://app.netlify.com/).
   - Click **Add new site** > **Import an existing project**.
   - Kết nối với tài khoản GitHub của bạn và chọn repository `electronic-store` (hoặc `thanh01pmt/electronic-store`).
3. **Cấu hình thông tin Build**:
   - Netlify sẽ tự động nhận diện ứng dụng Next.js và điền sẵn:
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`
4. **Nhập Biến Môi Trường**:
   - Click vào **Advanced build settings** hoặc vào **Environment variables**.
   - Thêm tất cả các biến môi trường được liệt kê ở bảng phía trên (Đặc biệt đảm bảo `NEXT_PUBLIC_APP_URL` là `https://ele-store.netlify.app`).
5. **Deploy**:
   - Click **Deploy site**. Netlify sẽ tự động tải các gói phụ thuộc, build ứng dụng và phát hành trực tuyến.

---

### Cách 2: Deploy trực tiếp bằng Netlify CLI (Thử nghiệm nhanh)

Nếu muốn deploy trực tiếp từ máy của bạn:

1. **Đăng nhập Netlify CLI**:
   ```bash
   netlify login
   ```
2. **Khởi tạo và liên kết site**:
   ```bash
   netlify init
   ```
   *Làm theo hướng dẫn trên màn hình để liên kết với site `ele-store`.*
3. **Thêm biến môi trường qua CLI** (hoặc cấu hình trên web dashboard):
   ```bash
   netlify env:set NEXT_PUBLIC_APP_URL "https://ele-store.netlify.app"
   # Lặp lại cho các biến môi trường khác
   ```
4. **Deploy**:
   ```bash
   # Deploy bản nháp (draft preview)
   netlify deploy
   
   # Deploy lên môi trường production
   netlify deploy --prod
   ```

---

## ⚡ Các Cấu HÌnh Bắt Buộc Khác Sau Khi Deploy (Post-Deployment Tasks)

Để các tính năng hoạt động hoàn chỉnh, bạn cần cập nhật URL Netlify mới vào các dịch vụ bên thứ ba:

1. **Clerk Authentication**:
   - Truy cập Clerk Dashboard.
   - Thêm URL trang Netlify `https://ele-store.netlify.app` vào danh sách **Allowed Origins** hoặc cập nhật mục **Production instance URL** nếu bạn chuyển sang môi trường Live.
2. **AWS S3 CORS Configuration**:
   - Để ứng dụng tải ảnh hoặc tệp từ S3 trực tiếp trên client, đảm bảo bạn cấu hình CORS trong AWS S3 bucket cho phép domain `https://ele-store.netlify.app` truy cập:
     ```json
     [
         {
             "AllowedHeaders": ["*"],
             "AllowedMethods": ["GET", "HEAD", "PUT", "POST"],
             "AllowedOrigins": ["https://ele-store.netlify.app"],
             "ExposeHeaders": []
         }
     ]
     ```
