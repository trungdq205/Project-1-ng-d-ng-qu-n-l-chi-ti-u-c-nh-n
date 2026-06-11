# FinApp — Bảng Điều Khiển Quản Lý Tài Chính Cá Nhân

Chào mừng bạn đến với dự án **FinApp**! Đây là một ứng dụng web Quản lý tài chính cá nhân được thiết kế hiện đại với giao diện Glassmorphism (hiệu ứng kính mờ), kết hợp sức mạnh của Trí tuệ Nhân tạo (Google Gemini) để làm trợ lý tài chính tư vấn trực tiếp cho người dùng.

## Tính năng nổi bật

*   **Tính toán số dư tự động:** Cập nhật ngay lập tức tỷ lệ thu chi và số dư hiện có.
*   **Trực quan hóa dữ liệu (Charts):** Sử dụng các biểu đồ (Pie Chart, Bar Chart, Line Chart) cực tinh tế thông qua Recharts.
*   **Trợ lý Ảo AI (FinBot):** Được tích hợp Google GenAI (Mô hình Gemini 2.5 Flash), FinBot có thể "đọc" chỉ số tài chính của bạn và đưa ra lời khuyên thiết thực như một chuyên gia tài chính thật sự.
*   **Lịch thông minh:** Theo dõi ngày giờ và lịch sử giao dịch trực quan.
*   **Báo cáo chuyên sâu:** Biểu đồ dòng tiền 6 tháng, xu hướng tài sản ròng toàn thời gian, top chi tiêu tốn kém.
*   **Xác thực người dùng:** Đăng ký, đăng nhập với JWT Token bảo mật.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|------------|-----------|
| Frontend | React 19 + Vite |
| Styling | Vanilla CSS (Glassmorphism) |
| Biểu đồ | Recharts |
| Icons | Lucide React |
| AI Chatbot | Google GenAI (Gemini 2.5 Flash) |
| Backend | Node.js + Express.js |
| Database | MySQL 8.0 |
| Xác thực | JSON Web Token (JWT) + bcryptjs |

---

## Hướng dẫn cài đặt và chạy ứng dụng

Thực hiện các bước sau để chạy dự án trên máy của bạn:

### 1. Yêu cầu hệ thống

*   Đã cài đặt [Node.js](https://nodejs.org/) (phiên bản 18 trở lên).
*   Đã cài đặt **MySQL Server** (có thể dùng [XAMPP](https://www.apachefriends.org/), [WampServer](https://www.wampserver.com/), hoặc [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)).

### 2. Clone dự án về máy

```bash
git clone https://github.com/TrungHK/Qu-n-l-t-i-ch-nh-c-nh-n.git
cd Qu-n-l-t-i-ch-nh-c-nh-n
```

### 3. Cài đặt Backend

#### 3.1. Cài đặt thư viện Backend
```bash
cd backend
npm install
```

#### 3.2. Tạo file cấu hình `backend/.env`

Tạo một file tên `.env` bên trong thư mục `backend/` với nội dung sau (chỉnh sửa cho phù hợp với máy của bạn):

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=mật_khẩu_mysql_của_bạn
DB_NAME=finapp_db
JWT_SECRET=đặt_một_chuỗi_bí_mật_bất_kỳ_ở_đây
```

> **Lưu ý:**
> - Nếu bạn dùng XAMPP, mật khẩu MySQL mặc định thường là rỗng (để trống `DB_PASSWORD=`).
> - `JWT_SECRET` là chuỗi bí mật dùng để mã hóa token đăng nhập, bạn có thể đặt bất kỳ chuỗi nào.

#### 3.3. Bật MySQL Server

- **XAMPP**: Mở XAMPP Control Panel → Bấm **Start** ở dòng MySQL.
- **MySQL Workbench**: Vào Server → Startup/Shutdown → Start Server.
- **Windows Services**: Mở ứng dụng Services → Tìm `MySQL80` → Click chuột phải → Start.

#### 3.4. Khởi tạo Database (chỉ cần chạy 1 lần duy nhất)

```bash
node init_db.js
```

Lệnh này sẽ tự động:
- Tạo database `finapp_db`
- Tạo các bảng: `users`, `categories`, `transactions`
- Chèn dữ liệu mẫu (tài khoản test: `test@finapp.vn` / mật khẩu: `123456`)

#### 3.5. Chạy Backend Server

```bash
node server.js
```

Khi thấy dòng `Server Backend đang chạy tại http://localhost:5000` là thành công. **Giữ cửa sổ Terminal này mở**.

---

### 4. Cài đặt Frontend

Mở một cửa sổ **Terminal mới** (giữ nguyên Terminal Backend đang chạy):

#### 4.1. Cài đặt thư viện Frontend

```bash
cd ..
npm install
```
*(Hoặc nếu bạn đang ở thư mục gốc dự án thì chỉ cần `npm install`)*

#### 4.2. Tạo file cấu hình `.env` (cho AI Chatbot)

Tạo file `.env` ở **thư mục gốc** của dự án (cùng cấp với `package.json`):

```env
VITE_GEMINI_API_KEY=điền_mã_api_key_của_bạn_vào_đây
```

> Bạn có thể lấy API Key miễn phí tại [Google AI Studio](https://aistudio.google.com/app/apikey).
> Nếu không có API Key, ứng dụng vẫn chạy bình thường — chỉ tính năng AI Chatbot (FinBot) sẽ không hoạt động.

#### 4.3. Chạy Frontend

```bash
npm run dev
```

Trình duyệt sẽ hiển thị đường dẫn (thường là `http://localhost:5173`). Bấm vào đó hoặc dán lên trình duyệt để sử dụng!

---

### 5. Tài khoản đăng nhập mẫu

| Email | Mật khẩu |
|-------|----------|
| `test@finapp.vn` | `123456` |

---

## Cấu trúc thư mục

```
finance-dashboard/
├── .env                  ← API Key cho AI (không có trên Git)
├── package.json          ← Dependencies Frontend
├── vite.config.js
├── index.html
├── src/
│   ├── App.jsx           ← Component chính
│   ├── App.css           ← Stylesheet chính
│   ├── index.css         ← CSS gốc (font, biến màu)
│   ├── Login.jsx         ← Trang đăng nhập / đăng ký
│   ├── CalendarWidget.jsx← Lịch chi tiêu
│   ├── SummaryStats.jsx  ← Thẻ thống kê (Thu/Chi/Tiết kiệm)
│   ├── Charts.jsx        ← Biểu đồ Pie + Bar
│   ├── Transactions.jsx  ← Quản lý giao dịch (CRUD)
│   ├── Reports.jsx       ← Báo cáo phân tích chuyên sâu
│   └── FinBot.jsx        ← Trợ lý AI Chatbot
└── backend/
    ├── .env              ← Cấu hình DB & JWT (không có trên Git)
    ├── package.json      ← Dependencies Backend
    ├── database.js       ← Kết nối MySQL (Connection Pool)
    ├── init_db.js        ← Script khởi tạo DB + Seed Data
    └── server.js         ← API Server (Express.js)
```
