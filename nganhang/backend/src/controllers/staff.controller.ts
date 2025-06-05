import { Request, Response, RequestHandler } from "express";
import { executeQuery } from "../services/executeQuery";    
import sql from 'mssql';

export const getAllStaff: RequestHandler = async (
    req: Request,
    res: Response
  ) => {
    try {
      const query = `
          EXECUTE [dbo].[xem_toan_bo_nhan_vien] 
          `;
      const result = await executeQuery(query, []);
      res.status(200).json({
        message: "Get all staff successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error log all staff: ", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

export const postStaff: RequestHandler = async (
    req: Request,
    res: Response,
) => {
    try {
        let { MANV, HO, TEN, CMND, DIACHI, PHAI, SODT, MACN } = req.body;

        const query = `
        EXECUTE [dbo].[them_nhan_vien] 
            @MANV
            ,@HO
            ,@TEN
            ,@CMND
            ,@DIACHI
            ,@PHAI
            ,@SODT
            ,@MACN
        `;
        const params = [
        { name: "MANV", type: sql.NChar(10), value: MANV },
        { name: "HO", type: sql.NVarChar(40), value: HO },
        { name: "TEN", type: sql.NVarChar(10), value: TEN },
        { name: "CMND", type: sql.NChar(10), value: CMND },
        { name: "DIACHI", type: sql.NVarChar(100), value: DIACHI },
        { name: "PHAI", type: sql.NVarChar(3), value: PHAI },
        { name: "SODT", type: sql.NVarChar(15), value: SODT },
        { name: "MACN", type: sql.NChar(10), value: MACN },
        ];

        const result: any = await executeQuery(query, params);
        if (result[0]?.code == 0) {
            res.status(200).json({ message: result[0].message, success: true });
        } else if (result[0]?.code != 0) {
            res.status(400).json({ message: result[0].message, success: false });
        } else {
        res.status(500).json({ message: "Unexpected error", success: false });
        }

    } catch (error) {
        console.error("Error creating staff:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const putStaff: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    try {
      let { MANV, HO, TEN, CMND, DIACHI, PHAI, SODT, MACN, TrangThaiXoa} = req.body;
      if (TrangThaiXoa == true) {
        TrangThaiXoa = 1
      }
      else {TrangThaiXoa = 0}
      const query = `
        EXECUTE [dbo].[sua_nhan_vien] 
            @MANV
            ,@HO
            ,@TEN
            ,@CMND
            ,@DIACHI
            ,@PHAI
            ,@SODT
            ,@MACN
            ,@TrangThaiXoa
      `;
      const params = [
        { name: "MANV", type: sql.NChar(10), value: MANV },
        { name: "HO", type: sql.NVarChar(40), value: HO },
        { name: "TEN", type: sql.NVarChar(10), value: TEN },
        { name: "CMND", type: sql.NChar(10), value: CMND },
        { name: "DIACHI", type: sql.NVarChar(100), value: DIACHI },
        { name: "PHAI", type: sql.NVarChar(3), value: PHAI },
        { name: "SODT", type: sql.NVarChar(15), value: SODT },
        { name: "MACN", type: sql.NChar(10), value: MACN },
        { name: "TrangThaiXoa", type: sql.Int, value: TrangThaiXoa }
      ];
  
      const result: any = await executeQuery(query, params);
        if (result[0]?.code == 0) {
            res.status(200).json({ message: result[0].message, success: true });
        } else if (result[0]?.code != 0) {
            res.status(400).json({ message: result[0].message, success: false });
        } else {
        res.status(500).json({ message: "Unexpected error", success: false });
        }
    } catch (error) {
      console.error("Error updating staff:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
export const getAStaff: RequestHandler = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { MANV } = req.body;
  
      const query = `
        EXECUTE [dbo].[xem_mot_nhan_vien] 
            @MANV
      `;
      const params = [
        { name: "MANV", type: sql.NChar(10), value: MANV }
      ];
  
      const result: any = await executeQuery(query, params);
        if (result[0]) {
            res.status(200).json({ message: result[0], success: true });
        } else {
        res.status(500).json({ message: "Unexpected error", success: false });
        }
    } catch (error) {
      console.error("Error updating staff:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };