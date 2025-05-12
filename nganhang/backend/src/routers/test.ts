import express, { Router, Request, Response, NextFunction } from "express";
import { executeQuery } from "../services/executeQuery";
const router1: Router = express.Router();
router1.get(
  "/test",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const pool: ConnectionPool = await connectDB();
      const query = `
      EXECUTE [dbo].[sp_xem_tat_ca_TK] 
      `;
      const result = await executeQuery(query, []);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching branches:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
export { router1 };
