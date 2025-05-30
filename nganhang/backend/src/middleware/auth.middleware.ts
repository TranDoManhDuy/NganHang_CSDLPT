import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
interface JwtPayload {
    account_number: string;
    account_type: string;
}
// Middleware kiểm tra và xác thực JWT
export const authenticateToken: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    // Token phải có dạng "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Access token missing'});
    } else {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not defined in environment variables.');
            res.status(500).json({ message: 'Server misconfiguration' });
        }
        else {
            try {
                const decoded = jwt.verify(token, secret);
                (req as any).user = decoded;
                next();
            } catch (err) {
                res.status(403).json({ message: 'Invalid or expired token' });
            }
        }
    }
};