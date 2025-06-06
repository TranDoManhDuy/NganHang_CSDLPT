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