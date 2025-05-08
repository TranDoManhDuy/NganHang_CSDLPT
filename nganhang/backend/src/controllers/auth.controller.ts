import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
interface JwtPayload {
    account_number: string;
    account_type: string;
}
export const login: RequestHandler = (req: Request, res: Response): void => {
    const { account_number, password, account_type} = req.body;
    if (account_number === '2874' && password === '123456') {
        const access_token = jwt.sign({ account_number, account_type }, process.env.JWT_SECRET!, {
            expiresIn: '30m'
        });
        const refresh_token = jwt.sign({ account_number, account_type }, process.env.JWT_SECRET!, {
            expiresIn: '7d'
        })
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,    // Chỉ có thể truy cập thông qua HTTP, không thể qua JavaScript
            // secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS nếu ở môi trường sản xuất
            secure: false,
            sameSite: 'lax', // Giới hạn cookie chỉ được gửi cho cùng một miền
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày (time in milliseconds)
        });
        res.status(200).json({ message: 'Login successful', access_token, success: true});
    }
    else {
        res.status(401).json({ message: 'Invalid credentials', success: false});
    }
};

export const refreshToken = (req: Request, res: Response, next: NextFunction): void => {
    // Lấy refresh token từ cookie
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
        res.status(403).json({ message: 'Refresh token is missing' });
    }
    else {
        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as JwtPayload;
    
            (req as any).user = decoded;
            let account_number = decoded.account_number
            let account_type = decoded.account_type

            const accessToken = jwt.sign(
                { account_number, account_type },
                process.env.JWT_SECRET!,
                { expiresIn: '30m' }
            );
            res.status(200).json({ access_token: accessToken });
        } catch (err) {
            res.status(403).json({ message: 'Invalid or expired refresh token' });
        }
    }
};