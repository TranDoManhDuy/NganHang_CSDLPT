import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";

import { getAllAccount, postAccount } from "../controllers/account.controller";

const router_account = Router();
router_account.get("/accounts", authenticateToken, getAllAccount);
router_account.post("/accounts", authenticateToken, postAccount);
// router_account.put("/accounts/:id", authenticateToken, getAllAccount);
// router_account.delete("/accounts/:id", authenticateToken, getAllAccount);
export { router_account };