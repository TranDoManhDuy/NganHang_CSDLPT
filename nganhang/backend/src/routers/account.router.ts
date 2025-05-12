import { getAllAccount } from "../controllers/account.controller";
import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";

const router_account = Router();
router_account.get("/accounts", authenticateToken, getAllAccount);
router_account.get("/accounts/:id", authenticateToken, getAllAccount);
router_account.post("/accounts/:id", authenticateToken, getAllAccount);
router_account.put("/accounts/:id", authenticateToken, getAllAccount);
router_account.delete("/accounts/:id", authenticateToken, getAllAccount);
export { router_account };
