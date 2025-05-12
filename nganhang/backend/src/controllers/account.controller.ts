import { NextFunction, Request, RequestHandler, Response } from "express";
import { executeQuery } from "../services/executeQuery";
export const getAllAccount: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    // const pool: ConnectionPool = await connectDB();
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
