import { NextFunction, Request, RequestHandler, Response } from "express";

import { executeQuery } from "../services/executeQuery";
import sql from "mssql";

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

export const postCustomer: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { CMND, HO, TEN, DIACHI, PHAI, SODT, MACN } = req.body;
    const query = `
      EXECUTE [dbo].[sp_them_khach_hang] 
              @CMND
              ,@HO
              ,@TEN
              ,@DIACHI
              ,@PHAI
              ,@SODT
              ,@MACN`;
    const params = [
      { name: "CMND", type: sql.NChar(10), value: CMND },
      { name: "HO", type: sql.NVarChar(50), value: HO },
      { name: "TEN", type: sql.NVarChar(50), value: TEN },
      { name: "DIACHI", type: sql.NVarChar(100), value: DIACHI },
      { name: "PHAI", type: sql.NVarChar(3), value: PHAI },
      { name: "SODT", type: sql.NVarChar(15), value: SODT },
      { name: "MACN", type: sql.NChar(10), value: MACN },
    ];
    var result: any = await executeQuery(query, params);
    if (result[0].code == 0) {
      res.status(400).json({
        message: result[0].message,
        seccess: false,
      });
      return;
    }
    if (result[0].code == 1) {
      res.status(200).json({
        message: result[0].message,
        success: true,
      });
      return;
    }
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: error });
  }
};

export const updateCustomer: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { CMND, HO, TEN, DIACHI, PHAI, SODT } = req.body;
    const query = `
      EXECUTE [dbo].[sp_sua_khach_hang] 
          @CMND
          ,@HO
          ,@TEN
          ,@DIACHI
          ,@PHAI
          ,@SODT`;
    const params = [
      { name: "CMND", type: sql.NChar(10), value: CMND },
      { name: "HO", type: sql.NVarChar(50), value: HO },
      { name: "TEN", type: sql.NVarChar(50), value: TEN },
      { name: "DIACHI", type: sql.NVarChar(100), value: DIACHI },
      { name: "PHAI", type: sql.NVarChar(3), value: PHAI },
      { name: "SODT", type: sql.NVarChar(15), value: SODT },
    ];
    var result = await executeQuery(query, params);
    if (result[0].code == 0) {
      res.status(400).json({
        message: result[0].message,
        seccess: false,
      });
      return;
    }
    if (result[0].code == 1) {
      res.status(200).json({
        message: result[0].message,
        success: true,
      });
      return;
    }
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ error: error });
  }
};

export const deleteCustomer: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { CMND } = req.body;
    console.log("CMND", req.body);
    const query = `
      EXECUTE [dbo].[sp_xoa_khach_hang] 
            @CMND`;
    const params = [{ name: "CMND", type: sql.NChar(10), value: CMND }];
    var result = await executeQuery(query, params);
    if (result[0].code == 0) {
      res.status(400).json({
        message: result[0].message,
        seccess: false,
      });
      return;
    }
    if (result[0].code == 1) {
      res.status(200).json({
        message: result[0].message,
        success: true,
      });
      return;
    }
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: error });
  }
};
