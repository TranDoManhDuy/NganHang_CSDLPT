import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  getAllAccount,
  postAccount,
  getAccountByNumber,
  processDepositWithdrawal,
  transferMoney,
  getAccountStatistics,
} from "../controllers/account.controller";

const router_account = Router();

// Existing routes
router_account.get("/accounts", authenticateToken, getAllAccount);
router_account.post("/accounts", authenticateToken, postAccount);
router_account.get("/accounts/:sotk", authenticateToken, getAccountByNumber);
router_account.post("/deposit-withdrawal", authenticateToken, processDepositWithdrawal);
router_account.post("/transfer-money", authenticateToken, transferMoney);
router_account.post("/account-statistics", authenticateToken, getAccountStatistics);

export { router_account };