import { Router } from "express";
import { login, refreshAccessToken } from "../controllers/auth.controller";

const router_auth = Router();
router_auth.post('/login', login);
router_auth.post('/refreshAccessToken', refreshAccessToken)

export { router_auth } 