import { authenticateToken } from "./../middleware/auth.middleware";
import { Router } from "express";
import {
  getInfoCustomer,
  getAlCustomer,
} from "../controllers/customer.controller";

const router_customer = Router();
router_customer.post("/getInfoCustomer", authenticateToken, getInfoCustomer);
router_customer.get("/customer", authenticateToken, getAlCustomer);

export { router_customer };
