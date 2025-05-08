import sql, { ConnectionPool } from "mssql";
import dotenv from "dotenv";
import { dbConfig } from "./env";

let pool: ConnectionPool | null = null;
export const connectDB = async (): Promise<ConnectionPool> => {
  // Load environment variables from .env file  
  try {
    if (pool) {
      console.log("Using existing connection pool.");
      return pool;
    }
    pool = await sql.connect(dbConfig);
    console.log("Connected to database.");
    return pool;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    if (pool) {
      await pool.close();
      console.log("Database connection closed.");
    }
  } catch (error) {
    console.error("Error closing database connection:", error);
  } finally {
    pool = null; // Reset the pool to null after closing
  }
};