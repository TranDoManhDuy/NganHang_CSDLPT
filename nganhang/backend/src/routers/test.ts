import express, { Router, Request, Response, NextFunction } from "express";
import { executeQuery } from "../services/executeQuery";
const testRouter: Router = express.Router();
testRouter.get(
  "/test",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // const pool: ConnectionPool = await connectDB();
      const query = `
      EXECUTE [dbo].[xem_mot_nhan_vien] @MANV = '001'
      `;
      const result = await executeQuery(query, []);
      console.log(result)
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching branches:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export { testRouter };