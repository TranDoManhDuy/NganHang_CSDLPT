import { NextFunction, Request, RequestHandler, Response } from "express";
import { executeQuery } from "../services/executeQuery";
import sql from 'mssql';

export const getAllAccount: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const query = `
        EXECUTE [dbo].[sp_xem_tat_ca_TK] 
        `;
    const result = await executeQuery(query, []);
    res.status(200).json({
      message: "Get all account successfully",
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postAccount: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { CMND, macn } = req.body;
    const query = `
        EXECUTE [dbo].[sp_tao_tai_khoan] 
          @CMND
          ,@macn
        `;
    const result = await executeQuery(query, [
      { name: "CMND", type: sql.NChar(10), value: CMND },
      { name: "macn", type: sql.NChar(50), value: macn },
    ]);
    if (result[0].code == 0) {
      res.status(400).json({
        message: result[0].message,
        seccess: false,
      });
      return
    }
    if (result[0].code == 1) {
      res.status(200).json({
        message: result[0].message,
        success: true,
      });
      return;
    }
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getAccountByNumber = async (
  req: Request,
  res: Response
): Promise<void> => {
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
    const result = await executeQuery(query, [
      { name: "sotk", type: sql.NChar, value: sotk }
    ]);

    if (!result || result.length === 0) {
      res.status(404).json({ error: "Account not found" });
      return;
    }

    res.status(200).json({
      message: "Get account by number successfully",
      data: result[0],
    });
  } catch (error) {
    console.error("Error fetching account by number:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const processDepositWithdrawal: RequestHandler = async (
  req,
  res
) => {
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

    const result = await executeQuery(query, [
      { name: "SOTK", type: sql.NChar, value: SOTK },
      { name: "LOAIGD", type: sql.NChar, value: LOAIGD },
      { name: "SOTIEN", type: sql.Money, value: SOTIEN },
      { name: "MANV", type: sql.NChar, value: "001" }
    ]);

    res.status(200).json({
      message: `Transaction (${LOAIGD === "GT" ? "Deposit" : "Withdrawal"}) completed successfully`,
      data: result
    });
  } catch (error: any) {
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
};

export const transferMoney: RequestHandler = async (
  req: Request,
  res: Response
) => {
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

    const result = await executeQuery(query, [
      { name: "SOTK_CHUYEN", type: sql.NChar, value: SOTK_CHUYEN },
      { name: "SOTIEN", type: sql.Money, value: SOTIEN },
      { name: "SOTK_NHAN", type: sql.NChar, value: SOTK_NHAN },
      { name: "MANV", type: sql.NChar, value: MANV },
    ]);

    // Check if the stored procedure returned success (return_value = 1)
    if (result && result[0]?.return_value === 1) {
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
    } else {
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
  } catch (error: any) {
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
};

export const getAccountStatistics: RequestHandler = async (
  req: Request,
  res: Response
) => {
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
    const result = await executeQuery(query, [
      { name: "MACN", type: sql.NChar, value: MACN },
      { name: "start_date", type: sql.Date, value: startDate },
      { name: "end_date", type: sql.Date, value: endDate },
    ]);

    if (result && result.length > 0) {
      const accounts = result;
      res.status(200).json({
        message: "Account statistics retrieved successfully",
        data: accounts,
      });
    } else {
      const error = new Error(
        result && result[0]?.message || "Failed to retrieve account statistics"
      );
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
  } catch (error: any) {
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
};
