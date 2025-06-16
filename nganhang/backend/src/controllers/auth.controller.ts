import { NextFunction, Request, RequestHandler, Response } from "express";
import { executeQuery } from "../services/executeQuery";
import sql from "mssql";
import jwt from "jsonwebtoken";
import { console } from "inspector";
interface JwtPayload {
  account_number: string;
  account_type: string;
}

export const login: RequestHandler = async (req: Request, res: Response) => {
  const { account_number, password, account_type } = req.body;
  const query = `EXECUTE [dbo].[xem_mot_nhan_vien] @MANV = @MANV`;
  const params = [{ name: "MANV", type: sql.VarChar, value: account_number }];
  try {
    const result = await executeQuery(query, params);

    if (result.length === 0) {
      res.status(401).json({ message: "Invalid credentials", success: false });
      return;
    }
    if (result.length > 0 && password == 123456) {
      const access_token = jwt.sign(
        { account_number, account_type },
        process.env.JWT_SECRET!,
        {
          expiresIn: "30m",
        }
      );
      const refresh_token = jwt.sign(
        { account_number, account_type },
        process.env.JWT_SECRET!,
        {
          expiresIn: "7d",
        }
      );
      res.cookie("refresh_token", refresh_token, {
        httpOnly: true, // Chỉ có thể truy cập thông qua HTTP, không thể qua JavaScript
        // secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS nếu ở môi trường sản xuất
        secure: true,
        sameSite: "lax", // Giới hạn cookie chỉ được gửi cho cùng một miền
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày (time in milliseconds)
      });
      res
        .status(200)
        .json({ message: "Login successful", access_token, success: true });
    } else {
      res.status(401).json({ message: "Invalid credentials", success: false });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: "Internal server error", success: false });
    return;
  }
};

export const refreshAccessToken = (req: Request, res: Response): void => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    res.status(403).json({ message: "Refresh token is missing" });
  } else {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET!
      ) as JwtPayload;

      (req as any).user = decoded;
      let account_number = decoded.account_number;
      let account_type = decoded.account_type;

      const accessToken = jwt.sign(
        { account_number, account_type },
        process.env.JWT_SECRET!,
        { expiresIn: "30m" }
      );
      res.status(200).json({ access_token: accessToken, success: true });
    } catch (err) {
      res
        .status(403)
        .json({ message: "Invalid or expired refresh token", success: false });
    }
  }
};

// xóa đi cookie
export const logout = (req: Request, res: Response): void => {
  res.clearCookie("refresh_token", {
    httpOnly: true, // Chỉ có thể truy cập thông qua HTTP, không thể qua JavaScript
    secure: true,
    sameSite: "lax", // Giới hạn cookie chỉ được gửi cho cùng một miền
  });
  res.status(200).json({ message: "Logout successful", success: true });
};
