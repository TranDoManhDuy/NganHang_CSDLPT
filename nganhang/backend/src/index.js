"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
// Load biến môi trường từ .env
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware toàn cục
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev')); // Logging
app.use(express_1.default.json()); // Parse JSON
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded
// Route gốc để kiểm tra server
app.get('/', (req, res) => {
    res.send('Server is running...');
});
// Sử dụng các router khác
// Middleware xử lý lỗi
// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
