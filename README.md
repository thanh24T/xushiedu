# XushiEdu 🎨

Ứng dụng web giáo dục dành cho trẻ em - học nhận diện đồ vật thông qua vẽ tay với AI.

---

## 📋 Yêu cầu hệ thống

| Công cụ | Phiên bản | Link tải |
|---|---|---|
| Python | 3.10+ | https://www.python.org/downloads/ |
| Node.js | 18+ | https://nodejs.org/ |
| SQL Server | 2019+ | https://www.microsoft.com/sql-server |
| ODBC Driver 17 | for SQL Server | https://learn.microsoft.com/sql/connect/odbc/download-odbc-driver-for-sql-server |

---

## 🗄️ Cài đặt Database

1. Mở **SQL Server Management Studio (SSMS)**
2. Tạo database mới:
```sql
CREATE DATABASE xushi_dacn1;
```
3. Flask sẽ tự tạo các bảng khi chạy lần đầu

---

## ⚙️ Cài đặt Backend (Flask)

```bash
# Di chuyển vào thư mục backend
cd backend

# Tạo virtual environment (khuyến nghị)
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt
```

### Cấu hình file `.env`

Tạo file `backend/.env` với nội dung:

```env
DB_SERVER=TÊN_MÁY_TÍNH\SQLEXPRESS
DB_NAME=xushi_dacn1
SECRET_KEY=xushi_secret_key_2024
```

> Thay `TÊN_MÁY_TÍNH` bằng tên máy tính của bạn. Kiểm tra bằng lệnh `$env:COMPUTERNAME` trong PowerShell.

### Chạy Backend

```bash
cd backend
python app.py
```

Backend sẽ chạy tại: `http://127.0.0.1:5000`

---

## 🖥️ Cài đặt Frontend (React)

```bash
# Di chuyển vào thư mục frontend
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## 🚀 Chạy ứng dụng

Cần mở **2 terminal** chạy song song:

**Terminal 1 - Backend:**
```bash
cd backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Sau đó mở trình duyệt và truy cập: **http://localhost:5173**

---

## 📦 Danh sách dependencies

### Backend (`backend/requirements.txt`)
```
flask
flask-cors
flask-sqlalchemy
pillow
numpy
scikit-learn
joblib
pyodbc
python-dotenv
werkzeug
```

### Frontend (`frontend/package.json`)
```
react
react-dom
react-router-dom
recharts
lucide-react
vite
```

---

## 📁 Cấu trúc project

```
dacn1_xushi/
├── backend/
│   ├── app.py              # Entry point Flask
│   ├── config.py           # Cấu hình database
│   ├── .env                # Biến môi trường (tự tạo)
│   ├── requirements.txt
│   ├── db/
│   │   └── models.py       # SQLAlchemy models
│   ├── ml/
│   │   └── predictor.py    # Xử lý model ML
│   ├── ml_models/
│   │   └── mlp_model_v401.pkl  # File model đã train
│   └── routes/
│       ├── auth.py         # Đăng nhập / Đăng ký
│       ├── predict.py      # Nhận diện hình vẽ
│       └── progress.py     # Tiến độ học tập
│
└── frontend/
    ├── index.html
    ├── package.json
    └── src/
        ├── App.jsx
        ├── components/     # Sidebar, Navbar, Canvas...
        ├── pages/          # Dashboard, Lessons, Achievements...
        └── data/
            └── lessons.js  # Dữ liệu bài học
```

---

## 🔑 Tài khoản mặc định

Sau khi chạy lần đầu, tạo tài khoản qua trang `/register` hoặc thêm thủ công trong SSMS:

```sql
-- Chạy trong SSMS sau khi Flask đã tạo bảng
USE xushi_dacn1;
-- Dùng trang /register để tạo tài khoản mới
```

---

## ❗ Lưu ý

- Backend phải chạy **trước** khi dùng Frontend
- File model `.pkl` phải nằm trong thư mục `backend/ml_models/`
- SQL Server phải đang chạy trước khi khởi động Flask
- ODBC Driver 17 bắt buộc phải cài để kết nối SQL Server
