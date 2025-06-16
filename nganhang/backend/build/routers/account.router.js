"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router_account = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const account_controller_1 = require("../controllers/account.controller");
const router_account = (0, express_1.Router)();
exports.router_account = router_account;
// Existing routes
router_account.get("/accounts", auth_middleware_1.authenticateToken, account_controller_1.getAllAccount);
router_account.post("/accounts", auth_middleware_1.authenticateToken, account_controller_1.postAccount);
router_account.get("/accounts/:sotk", auth_middleware_1.authenticateToken, account_controller_1.getAccountByNumber);
router_account.post("/deposit-withdrawal", auth_middleware_1.authenticateToken, account_controller_1.processDepositWithdrawal);
router_account.post("/transfer-money", auth_middleware_1.authenticateToken, account_controller_1.transferMoney);
router_account.post("/account-statistics", auth_middleware_1.authenticateToken, account_controller_1.getAccountStatistics);
router_account.post("/account-statement", account_controller_1.getAccountStatement);
