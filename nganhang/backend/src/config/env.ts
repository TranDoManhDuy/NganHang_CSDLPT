require("dotenv").config();

export const db0Config = {
  user: process.env.DB_USER_SERVER0,
  password: process.env.DB_PASSWORD_SERVER0,
  server: process.env.DB_HOST_SERVER0 || "localhost", // Use localhost if not provided
  port: Number(process.env.DB_PORT_SERVER0) || 1433, // Default SQL Server port
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
    instancename: "SQLEXPRESS",
  }, // Change to true for local dev / self-signed certs
};
