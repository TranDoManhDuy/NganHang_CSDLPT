"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router_branch = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const branch_controller_1 = require("../controllers/branch.controller");
const router_branch = (0, express_1.Router)();
exports.router_branch = router_branch;
router_branch.get("/branches", auth_middleware_1.authenticateToken, branch_controller_1.getBranchCurrent);
