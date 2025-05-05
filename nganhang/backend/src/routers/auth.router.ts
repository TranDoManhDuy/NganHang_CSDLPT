import { Router } from "express";
import { login } from "../controllers/auth.controller";
// import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
router.post('/login', login);

// Bảo vệ route này
// router.get('/profile', authenticateToken, (req, res) => {
//     res.json({ message: 'This is a protected route', user: (req as any).user });
//   });

export { router }