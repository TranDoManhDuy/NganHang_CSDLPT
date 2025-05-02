import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

// Load biến môi trường từ .env
dotenv.config();

const app: Application = express();

// Middleware toàn cục
app.use(cors());
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Route gốc để kiểm tra server
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running...');
});

// Sử dụng các router khác
// Middleware xử lý lỗi

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
