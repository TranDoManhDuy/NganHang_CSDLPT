# Giải thích cấu trúc chuẩn của một dự án backend NodeJS sử dụng TypeScript.

backend/
├── node_modules/          # Thư mục chứa các thư viện đã cài đặt
├── src/                  # Thư mục chứa mã nguồn
|   ├── config/                 # Cấu hình ứng dụng
|   │   ├── database.ts             # Cấu hình kết nối cơ sở dữ liệu (MSSQL)
|   │   ├── env.ts                  # Quản lý biến môi trường (dùng dotenv)
|   │   └── middleware.ts           # Cấu hình middleware chung (chưa chốt file này)
│   ├── controllers/            # Xử lý logic nghiệp vụ cho các endpoint
|   │   ├── object1Controller.ts           # Logic cho các API liên quan đến object1  
|   │   └── object2Controller.ts           # Logic cho các API liên quan đến object2
│   ├── middleware/       # Chứa các middleware (xử lý giữa request và response)(chưa soạn được)
│   ├── models/           # Định nghĩa schema/model cho database
|   │   ├── object1Model.ts         # Schema cho object1
|   │   └── object2Model.ts         # Schema cho object2 
│   ├── routers/          # Định nghĩa các route API
|   │   ├── object1Routes.js        # route API cho object1 
|   │   ├── object2Routes.js        # route API cho object2 
|   │   └── index.js             # Tổng hợp tất cả các route API
│   ├── services/         # Logic dịch vụ (kết nối DB, API bên thứ 3)
|   |   ├── executeQuery.ts # thực hiện câu lệnh sql 
|   |   └── ...
│   ├── utils/            # Các hàm tiện ích, helper
|   ├── .env              # Biến môi trường
│   └── index.ts          # File khởi chạy server
├── package-lock.json     # File khóa phiên bản dependencies
├── package.json          # File quản lý dependencies và scripts
└── tsconfig.json         # File cấu hình TypeScript

1. Config
- Chức năng: cấu hình ứng dụngdụng
- Vai trò: cấu hình, quản lý những thành phần như kết nối DB, biến môi trường .env 
- Mỗi file trong thư mục tương ứng với cấu hình của các thành phần liên quan 

2. Controllers
- Chức năng: chứa các controller, là nơi xử lý logic nghiệp vụ cho các endpoint API.
- Vai trò: Nhận request từ client, xử lý logic nghiệp vụ và trả về response.
- Mỗi file trong thư mục tương ứng với một nhóm endpoint.

3. middleware
- Chức năng: là hàm xử lý trung gian giữa request và response.
- Vai trò: 
    + Xử lý các tác vụ như xác thực (Authentication), kiểm tra quyền (Authorization), logging, hoặc xử lý lỗi.
    + Middleware được áp dụng trước khi request đến controller hoặc sau khi response được gửi đi.

4. Models
- Chức năng: Chứa các model hoặc schema, dùng để định nghĩa cấu trúc dữ liệu khi làm việc với database
- Vai trò:
    + Định nghĩa cấu trúc dữ liệu.
    + Đảm bảo type safety khi làm việc với TypeScript.

5. Routers
- Chức năng: Chứa các router, nơi định nghĩa các route và gắn chúng với các controller.
- Vai trò:
    + Tổ chức các endpoint theo nhóm.
    + Gắn các HTTP method với các hàm xử lý controller.

6. Services
- Chức năng: Chứa các service, là nơi chứa logic nghiệp vụ phức tạp, thường liên quan đến db hoặc API bên thứ 3.
- Vai trò:
    + Tách biệt logic nghiệp vụ khỏi controllers, giúp controller chỉ tập trung vào việc nhận và trả response.
    + Dễ tái sử dụng logic giữa các Controller.

7. Utils
- Chức năng: Chứa các utility hoặc helper, là các hàm tiện ích hỗ trợ các phần khác của ứng dụng.
- Vai trò:
    + Cung cấp các hàm dùng chung như logging, format dữ liệu, xử lý lỗi.
    + Giảm lặp code và tăng tính tái sử dụng.

7. index.ts
- Chức năng: nơi khởi chạy server, nơi thiết lập ứng dụng Express và chạy server.
- Vai trò: Khởi tạo server, thiết lập các middleware toàn cục và gắn các router.
    + Là điểm bắt đầu của ứng dụng.