import { authenticateToken } from "./../middleware/auth.middleware";
import { Router } from "express";

import { chuyennhanvien, getAllStaff, getAStaff, postStaff, putStaff } from "../controllers/staff.controller";

const router_staff = Router();
router_staff.get("/staff", getAllStaff);
router_staff.post("/staff", postStaff)
router_staff.put("/staff", putStaff)
router_staff.get("/getAStaff", getAStaff)
router_staff.post("/chuyen_chi_nhanh", chuyennhanvien)
export {router_staff}