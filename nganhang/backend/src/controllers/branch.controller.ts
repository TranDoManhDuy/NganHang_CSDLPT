import { NextFunction, Request, RequestHandler, Response } from "express";
import { executeQuery } from "../services/executeQuery";
export const getBranchCurrent: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const query = `
        SELECT [MACN]
                ,[TENCN]
        FROM [NGANHANG].[dbo].[ChiNhanh] 
        `;
    const result = await executeQuery(query, []);
    res.status(200).json({
      message: "Get all branch successfully",
      data: result,
    });
    console.log("Get all branch successfully");
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};