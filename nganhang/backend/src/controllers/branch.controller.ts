import { NextFunction, Request, RequestHandler, Response } from "express";
import { executeQuery } from "../services/executeQuery";
export const getBranchCurrent: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // const pool: ConnectionPool = await connectDB();
    const query = `
        SELECT TOP (1) [MACN]
                ,[TENCN]
        FROM [NGANHANG].[dbo].[ChiNhanh] 
        `;
    const result = await executeQuery(query, []);
    res.status(200).json({
      message: "Get all branch successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};