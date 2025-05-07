import express, { Router, Request, Response, NextFunction } from "express";
import { ConnectionPool } from "mssql";
import { connectDB } from "../config/database";

const router1: Router = express.Router();
router1.get(
  "/getchinhanh", 
  async (req: Request, res: Response, next: NextFunction) => {
    let pool: ConnectionPool;
    try {
      pool = await connectDB();
      const result = await pool.request().query("SELECT * FROM CHINHANH");
      // console.log(result.recordset);
      res.json(result.recordset);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
    }
  }
);
export { router1 };
