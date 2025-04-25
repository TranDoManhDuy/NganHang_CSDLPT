const sql = require("mssql");

const config = {
  user: "sa",
  password: "123",
  server: "localhost",
  database: "NGANHANG",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

module.exports = config;