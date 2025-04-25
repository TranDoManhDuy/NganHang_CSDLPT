const express = require("express");
const sql = require("mssql");
const dbConfig = require("../db");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT * FROM NhanVien
    `;

    if (result.recordset.length > 0) {
      res.json({ success: true, user: result.recordset[0] });
    } else {
      res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu." });
    }
  } catch (err) {
    console.error("Lỗi:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ." });
  }
});

module.exports = router;