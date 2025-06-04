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
      { name: "CMND", type: sql.NChar, value: CMND },
      { name: "macn", type: sql.NChar, value: macn },
    ]);
    res.status(200).json({
      message: "Create account successfully",
      // data: result,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};