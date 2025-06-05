import { Router } from "express";
import { login, refreshToken } from "../controllers/auth.controller";

const router_auth = Router();
router_auth.post('/login', login); 
router_auth.post('/refreshToken', refreshToken)

export { router_auth }