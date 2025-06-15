"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountStatement = exports.getAccountStatistics = exports.transferMoney = exports.processDepositWithdrawal = exports.getAccountByNumber = exports.postAccount = exports.getAllAccount = void 0;
const executeQuery_1 = require("../services/executeQuery");
const mssql_1 = __importDefault(require("mssql"));
const getAllAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
        EXECUTE [dbo].[sp_xem_tat_ca_TK] 
        `;
        const result = yield (0, executeQuery_1.executeQuery)(query, []);
        res.status(200).json({
            message: "Get all account successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error fetching branches:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllAccount = getAllAccount;
const postAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { CMND, macn } = req.body;
        const query = `
        EXECUTE [dbo].[sp_tao_tai_khoan] 
          @CMND
          ,@macn
        `;
        const result = yield (0, executeQuery_1.executeQuery)(query, [
            { name: "CMND", type: mssql_1.default.NChar, value: CMND },
            { name: "macn", type: mssql_1.default.NChar, value: macn },
        ]);
        res.status(200).json({
            message: "Create account successfully",
            // data: result,
        });
    }
    catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.postAccount = postAccount;
const getAccountByNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sotk } = req.params;
        if (!sotk || typeof sotk !== "string" || sotk.length !== 9) {
            res.status(400).json({ error: "Invalid account number" });
            return;
        }
        const query = `
      DECLARE @return_value INT;
      EXEC @return_value = [dbo].[sp_tim_TK_theo_sotk] @sotk = @sotk;
    `;
        const result = yield (0, executeQuery_1.executeQuery)(query, [
            { name: "sotk", type: mssql_1.default.NChar, value: sotk }
        ]);
        if (!result || result.length === 0) {
            res.status(404).json({ error: "Account not found" });
            return;
        }
        res.status(200).json({
            message: "Get account by number successfully",
            data: result[0],
        });
    }
    catch (error) {
        console.error("Error fetching account by number:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAccountByNumber = getAccountByNumber;
const processDepositWithdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { SOTK, LOAIGD, SOTIEN } = req.body;
        // Validate input parameters
        if (!SOTK || typeof SOTK !== "string" || SOTK.length !== 9) {
            res.status(400).json({ error: "Invalid account number" });
            return;
        }
        if (!LOAIGD || (LOAIGD !== "GT" && LOAIGD !== "RT")) {
            res.status(400).json({ error: "Invalid transaction type (must be 'GT' or 'RT')" });
            return;
        }
        if (!SOTIEN || typeof SOTIEN !== "number" || SOTIEN <= 0) {
            res.status(400).json({ error: "Invalid amount (must be a positive number)" });
            return;
        }
        const query = `
      EXECUTE [dbo].[sp_gui_rut_tien] 
        @SOTK = @SOTK,
        @LOAIGD = @LOAIGD,
        @SOTIEN = @SOTIEN,
        @MANV = @MANV
    `;
        const result = yield (0, executeQuery_1.executeQuery)(query, [
            { name: "SOTK", type: mssql_1.default.NChar, value: SOTK },
            { name: "LOAIGD", type: mssql_1.default.NChar, value: LOAIGD },
            { name: "SOTIEN", type: mssql_1.default.Money, value: SOTIEN },
            { name: "MANV", type: mssql_1.default.NChar, value: "001" }
        ]);
        res.status(200).json({
            message: `Transaction (${LOAIGD === "GT" ? "Deposit" : "Withdrawal"}) completed successfully`,
            data: result
        });
    }
    catch (error) {
        console.error("Error processing transaction:", error);
        if (error.message.includes("SO DU TAI KHOAN KHONG DU")) {
            res.status(400).json({ error: "Insufficient account balance" });
            return;
        }
        if (error.message.includes("TAI KHOAN KHONG TON TAI")) {
            res.status(404).json({ error: "Account not found" });
            return;
        }
        if (error.message.includes("NHAN VIEN KHONG TON TAI")) {
            res.status(400).json({ error: "Employee not found" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.processDepositWithdrawal = processDepositWithdrawal;
const transferMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { SOTK_CHUYEN, SOTIEN, SOTK_NHAN, MANV } = req.body;
        // Validate input parameters
        if (!SOTK_CHUYEN || typeof SOTK_CHUYEN !== "string" || SOTK_CHUYEN.length !== 9) {
            const error = new Error("Invalid source account number");
            console.error({
                message: error.message,
                SOTK_CHUYEN,
                timestamp: new Date().toISOString(),
                endpoint: "/api/transfer-money",
            });
            res.status(400).json({ error: error.message });
            return;
        }
        if (!SOTK_NHAN || typeof SOTK_NHAN !== "string" || SOTK_NHAN.length !== 9) {
            const error = new Error("Invalid destination account number");
            console.error({
                message: error.message,
                SOTK_NHAN,
                timestamp: new Date().toISOString(),
                endpoint: "/api/transfer-money",
            });
            res.status(400).json({ error: error.message });
            return;
        }
        if (!SOTIEN || typeof SOTIEN !== "number" || SOTIEN <= 0) {
            const error = new Error("Invalid amount (must be a positive number)");
            console.error({
                message: error.message,
                SOTIEN,
                timestamp: new Date().toISOString(),
                endpoint: "/api/transfer-money",
            });
            res.status(400).json({ error: error.message });
            return;
        }
        if (!MANV || typeof MANV !== "string") {
            const error = new Error("Invalid employee ID");
            console.error({
                message: error.message,
                MANV,
                timestamp: new Date().toISOString(),
                endpoint: "/api/transfer-money",
            });
            res.status(400).json({ error: error.message });
            return;
        }
        const query = `
      DECLARE @return_value INT;
      EXEC @return_value = [dbo].[sp_chuyen_tien]
        @SOTK_CHUYEN = @SOTK_CHUYEN,
        @SOTIEN = @SOTIEN,
        @SOTK_NHAN = @SOTK_NHAN,
        @MANV = @MANV;
      SELECT @return_value as return_value;
    `;
        const result = yield (0, executeQuery_1.executeQuery)(query, [
            { name: "SOTK_CHUYEN", type: mssql_1.default.NChar, value: SOTK_CHUYEN },
            { name: "SOTIEN", type: mssql_1.default.Money, value: SOTIEN },
            { name: "SOTK_NHAN", type: mssql_1.default.NChar, value: SOTK_NHAN },
            { name: "MANV", type: mssql_1.default.NChar, value: MANV },
        ]);
        // Check if the stored procedure returned success (return_value = 1)
        if (result && ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.return_value) === 1) {
            res.status(200).json({
                message: "Money transfer completed successfully",
                data: {
                    SOTK_CHUYEN,
                    SOTIEN,
                    SOTK_NHAN,
                    MANV,
                    NGAYGD: new Date(),
                },
            });
        }
        else {
            const error = new Error("Money transfer failed");
            console.error({
                message: error.message,
                SOTK_CHUYEN,
                SOTK_NHAN,
                SOTIEN,
                MANV,
                result,
                timestamp: new Date().toISOString(),
                endpoint: "/api/transfer-money",
            });
            res.status(400).json({ error: error.message });
        }
    }
    catch (error) {
        console.error({
            message: "Error processing money transfer",
            error: error.message,
            stack: error.stack,
            SOTK_CHUYEN: req.body.SOTK_CHUYEN,
            SOTK_NHAN: req.body.SOTK_NHAN,
            SOTIEN: req.body.SOTIEN,
            MANV: req.body.MANV,
            timestamp: new Date().toISOString(),
            endpoint: "/api/transfer-money",
        });
        // Handle specific errors from the stored procedure
        if (error.message.includes("TK CHUYEN KHONG TON TAI")) {
            res.status(404).json({ error: "Source account not found" });
            return;
        }
        if (error.message.includes("TK NHAN KHONG TON TAI")) {
            res.status(404).json({ error: "Destination account not found" });
            return;
        }
        if (error.message.includes("NHAN VIEN KHONG TON TAI")) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }
        if (error.message.includes("SO DU TAI KHOAN CHUYEN KHONG DU")) {
            res.status(400).json({ error: "Insufficient balance in source account" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.transferMoney = transferMoney;
const getAccountStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { MACN, start_date, end_date } = req.body;
        // Validate input parameters
        if (!MACN || typeof MACN !== "string" || !["BENTHANH", "TANDINH", "ALL"].includes(MACN)) {
            const error = new Error("Invalid branch code (must be 'BENTHANH', 'TANDINH', or 'ALL')");
            console.error({
                message: error.message,
                MACN,
                timestamp: new Date().toISOString(),
                endpoint: "/api/account-statistics",
            });
            res.status(400).json({ error: error.message });
            return;
        }
        if (!start_date || !end_date || isNaN(Date.parse(start_date)) || isNaN(Date.parse(end_date))) {
            const error = new Error("Invalid date format for start_date or end_date");
            console.error({
                message: error.message,
                start_date,
                end_date,
                timestamp: new Date().toISOString(),
                endpoint: "/api/account-statistics",
            });
            res.status(400).json({ error: error.message });
            return;
        }
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        if (startDate > endDate) {
            const error = new Error("start_date must be less than or equal to end_date");
            console.error({
                message: error.message,
                start_date,
                end_date,
                timestamp: new Date().toISOString(),
                endpoint: "/api/account-statistics",
            });
            res.status(400).json({ error: error.message });
            return;
        }
        const query = `
      DECLARE @return_value INT;
      EXEC @return_value = [dbo].[sp_thong_ke_tai_khoan]
        @MACN = @MACN,
        @start_date = @start_date,
        @end_date = @end_date;
      SELECT @return_value as return_value;
    `;
        // Execute the stored procedure
        const result = yield (0, executeQuery_1.executeQuery)(query, [
            { name: "MACN", type: mssql_1.default.NChar, value: MACN },
            { name: "start_date", type: mssql_1.default.Date, value: startDate },
            { name: "end_date", type: mssql_1.default.Date, value: endDate },
        ]);
        if (result && result.length > 0) {
            const accounts = result;
            res.status(200).json({
                message: "Account statistics retrieved successfully",
                data: accounts,
            });
        }
        else {
            const error = new Error(result && ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.message) || "Failed to retrieve account statistics");
            console.error({
                message: error.message,
                MACN,
                start_date,
                end_date,
                result,
                timestamp: new Date().toISOString(),
                endpoint: "/api/account-statistics",
            });
            res.status(400).json({ error: error.message });
        }
    }
    catch (error) {
        console.error({
            message: "Error retrieving account statistics",
            error: error.message,
            stack: error.stack,
            MACN: req.body.MACN,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            timestamp: new Date().toISOString(),
            endpoint: "/api/account-statistics",
        });
        // Handle specific errors from the stored procedure
        if (error.message.includes("Chi nhánh không tồn tại")) {
            res.status(400).json({ error: "Branch does not exist" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAccountStatistics = getAccountStatistics;
const getAccountStatement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { SOTK_SAO_KE, NGAY_BAT_DAU, NGAY_KET_THUC } = req.body;
        // Validate input parameters
        if (!SOTK_SAO_KE || typeof SOTK_SAO_KE !== "string" || SOTK_SAO_KE.length !== 9) {
            const error = new Error("Invalid account number (must be a 9-character string)");
            console.error({
                message: error.message,
                SOTK_SAO_KE,
                timestamp: new Date().toISOString(),
                endpoint: "/api/account-statement",
            });
            res.status(400).json({ error: error.message });
            return;
        }
        if (!NGAY_BAT_DAU || !NGAY_KET_THUC || isNaN(Date.parse(NGAY_BAT_DAU)) || isNaN(Date.parse(NGAY_KET_THUC))) {
            const error = new Error("Invalid date format for NGAY_BAT_DAU or NGAY_KET_THUC");
            console.error({
                message: error.message,
                NGAY_BAT_DAU,
                NGAY_KET_THUC,
                timestamp: new Date().toISOString(),
                endpoint: "/api/account-statement",
            });
            res.status(400).json({ error: error.message });
            return;
        }
        const startDate = new Date(NGAY_BAT_DAU);
        const endDate = new Date(NGAY_KET_THUC);
        if (startDate > endDate) {
            const error = new Error("NGAY_BAT_DAU must be less than or equal to NGAY_KET_THUC");
            console.error({
                message: error.message,
                NGAY_BAT_DAU,
                NGAY_KET_THUC,
                timestamp: new Date().toISOString(),
                endpoint: "/api/account-statement",
            });
            res.status(400).json({ error: error.message });
            return;
        }
        const query = `
      DECLARE @return_value INT;
      EXEC @return_value = [dbo].[sp_sao_ke_tai_khoan]
        @SOTK_SAO_KE = @SOTK_SAO_KE,
        @NGAY_BAT_DAU = @NGAY_BAT_DAU,
        @NGAY_KET_THUC = @NGAY_KET_THUC;
      SELECT @return_value as return_value;
    `;
        // Execute the stored procedure
        const result = yield (0, executeQuery_1.executeQuery)(query, [
            { name: "SOTK_SAO_KE", type: mssql_1.default.NChar, value: SOTK_SAO_KE },
            { name: "NGAY_BAT_DAU", type: mssql_1.default.DateTime, value: startDate },
            { name: "NGAY_KET_THUC", type: mssql_1.default.DateTime, value: endDate },
        ]);
        if (result && result.length > 0) {
            res.status(200).json({
                message: "Account statement retrieved successfully",
                data: result,
            });
        }
        else {
            const error = new Error("Failed to retrieve account statement");
            console.error({
                message: error.message,
                SOTK_SAO_KE,
                NGAY_BAT_DAU,
                NGAY_KET_THUC,
                result,
                timestamp: new Date().toISOString(),
                endpoint: "/api/account-statement",
            });
            res.status(400).json({ error: error.message });
        }
    }
    catch (error) {
        console.error({
            message: "Error retrieving account statement",
            error: error.message,
            stack: error.stack,
            SOTK_SAO_KE: req.body.SOTK_SAO_KE,
            NGAY_BAT_DAU: req.body.NGAY_BAT_DAU,
            NGAY_KET_THUC: req.body.NGAY_KET_THUC,
            timestamp: new Date().toISOString(),
            endpoint: "/api/account-statement",
        });
        // Handle specific errors from the stored procedure
        if (error.message.includes("Tài khoản không tồn tại")) {
            res.status(400).json({ error: "Account does not exist" });
            return;
        }
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAccountStatement = getAccountStatement;
