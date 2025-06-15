"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware kiểm tra và xác thực JWT, access token, giúp bảo vệ các route cần thiết
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Token phải có dạng "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        // trong request ko có token
        res.status(401).json({ message: 'Access token missing', success: false });
    }
    else {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not defined in environment variables.');
            res.status(500).json({ message: 'Server misconfiguration', success: false });
        }
        else {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, secret);
                req.user = decoded;
                next();
            }
            catch (err) {
                // Access token không hợp lệ hoặc đã hết hạn
                res.status(401).json({ message: 'Invalid or expired token', success: false });
            }
        }
    }
};
exports.authenticateToken = authenticateToken;
