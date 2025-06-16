"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshAccessToken = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const login = (req, res) => {
    const { account_number, password, account_type } = req.body;
    if (account_number === '2874' && password === '123456') {
        const access_token = jsonwebtoken_1.default.sign({ account_number, account_type }, process.env.JWT_SECRET, {
            expiresIn: '30m'
        });
        const refresh_token = jsonwebtoken_1.default.sign({ account_number, account_type }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true, // Chỉ có thể truy cập thông qua HTTP, không thể qua JavaScript
            // secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS nếu ở môi trường sản xuất
            secure: true,
            sameSite: 'lax', // Giới hạn cookie chỉ được gửi cho cùng một miền
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày (time in milliseconds)
        });
        res.status(200).json({ message: 'Login successful', access_token, success: true });
    }
    else {
        res.status(401).json({ message: 'Invalid credentials', success: false });
    }
};
exports.login = login;
const refreshAccessToken = (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        res.status(403).json({ message: 'Refresh token is missing' });
    }
    else {
        try {
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
            req.user = decoded;
            let account_number = decoded.account_number;
            let account_type = decoded.account_type;
            const accessToken = jsonwebtoken_1.default.sign({ account_number, account_type }, process.env.JWT_SECRET, { expiresIn: '30m' });
            res.status(200).json({ access_token: accessToken, success: true });
        }
        catch (err) {
            res.status(403).json({ message: 'Invalid or expired refresh token', success: false });
        }
    }
};
exports.refreshAccessToken = refreshAccessToken;
// xóa đi cookie
const logout = (req, res) => {
    res.clearCookie('refresh_token', {
        httpOnly: true, // Chỉ có thể truy cập thông qua HTTP, không thể qua JavaScript
        secure: true,
        sameSite: 'lax', // Giới hạn cookie chỉ được gửi cho cùng một miền
    });
    res.status(200).json({ message: 'Logout successful', success: true });
};
exports.logout = logout;
