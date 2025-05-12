import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { router_auth } from "./routers/auth.router";
import { router_customer } from "./routers/customer.router";
import { router_account } from "./routers/account.router";
// Load biến môi trường từ .env
dotenv.config();

const app: Application = express();
// Middleware toàn cục
app.use(
  cors({
    origin: "http://localhost:3000", // chỉ cho phép origin này
    credentials: true,
  })
);
app.use(morgan("dev")); // Logging
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
app.use(cookieParser()); // Tự động reset access token

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running...");
});

app.use("/api/auth", router_auth);
app.use("/api/customer", router_customer);
import { router1 } from "./routers/test";
app.use("/api", router1);
app.use("/api", router_account);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
