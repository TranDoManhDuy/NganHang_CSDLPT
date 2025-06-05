import { Router } from "express";
import { login, refreshAccessToken, logout} from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router_auth = Router();

router_auth.post('/login', login);
router_auth.get('/refreshAccessToken', refreshAccessToken);

router_auth.get('/logout', authenticateToken, logout);
router_auth.get('/verifyAccessToken', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Token is valid', success: true });
});
export { router_auth }