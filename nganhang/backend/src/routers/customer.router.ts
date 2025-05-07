import { authenticateToken } from './../middleware/auth.middleware';
import { Router } from "express";
import { getInfoCustomer } from "../controllers/customer.controller";

const router_customer = Router();
router_customer.post('/getInfoCustomer', authenticateToken, getInfoCustomer);

export {router_customer}