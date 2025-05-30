import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { getBranchCurrent } from "../controllers/branch.controller";

const router_branch = Router();
router_branch.get("/branches", authenticateToken, getBranchCurrent);
export { router_branch };