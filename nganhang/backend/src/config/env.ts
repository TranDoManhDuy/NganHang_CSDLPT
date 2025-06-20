require("dotenv").config();

export const dbConfig = {
  user: process.env.DB_USER_SERVER1,
  password: process.env.DB_PASSWORD_SERVER1,
  server: process.env.DB_HOST_SERVER1 || "localhost", // Use localhost if not provided
  port: Number(process.env.DB_PORT_SERVER1) || 1433, // Default SQL Server port
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
    instancename: "SQLEXPRESS",
  }, // Change to true for local dev / self-signed certs
};
