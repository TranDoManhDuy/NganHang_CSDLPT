import { NextFunction, Request, RequestHandler, Response } from "express";

import { executeQuery } from "../services/executeQuery";
export const getInfoCustomer: RequestHandler = (
  req: Request,
  res: Response
): void => {};
export const getAlCustomer: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const query = `
        SELECT TOP (1000) [CMND]
                ,[HO]
                ,[TEN]
                ,[DIACHI]
                ,[PHAI]
                ,[NGAYCAP]
                ,[SODT]
                ,[MACN]
                FROM [NGANHANG].[dbo].[KhachHang]`;
    const result = await executeQuery(query, []);
    res.status(200).json({
      message: "Get all customer successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
