import { Router } from "express";
import { login, refreshAccessToken, verifyAccessToken } from "../controllers/auth.controller";

const router_auth = Router();
router_auth.post('/login', login);
router_auth.get('/refreshAccessToken', refreshAccessToken);
router_auth.get('/verifyAccessToken', verifyAccessToken);

export { router_auth }