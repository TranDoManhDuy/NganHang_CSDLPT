import { authenticateToken } from "./../middleware/auth.middleware";
import { Router } from "express";
import {
  getInfoCustomer,
  getAlCustomer,
  postCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller";

const router_customer = Router();
router_customer.post("/getInfoCustomer", authenticateToken, getInfoCustomer);
router_customer.get("/customer", authenticateToken, getAlCustomer);
router_customer.post("/customer", authenticateToken, postCustomer);
router_customer.put("/customer", authenticateToken, updateCustomer);
router_customer.delete("/customer", authenticateToken, deleteCustomer);

export { router_customer };
