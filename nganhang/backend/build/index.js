"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_router_1 = require("./routers/auth.router");
const customer_router_1 = require("./routers/customer.router");
const account_router_1 = require("./routers/account.router");
const branch_router_1 = require("./routers/branch.router");
const staff_router_1 = require("./routers/staff.router");
// import { router_customer } from "./routers/customer.router";
// Load biến môi trường từ .env
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware toàn cục
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // chỉ cho phép origin này
    credentials: true,
}));
app.use((0, morgan_1.default)("dev")); // Logging
app.use(express_1.default.json()); // Parse JSON
app.use(express_1.default.urlencoded({ extended: true })); // Parse URL-encoded
app.use((0, cookie_parser_1.default)()); // Tự động reset access token
app.get("/", (req, res) => {
    res.send("Server is running...");
});
app.use("/api/auth", auth_router_1.router_auth);
app.use("/api", customer_router_1.router_customer);
// import { router1 } from "./routers/test";
// app.use("/api", router1);
app.use("/api", account_router_1.router_account);
app.use("/api", branch_router_1.router_branch);
app.use("/api", staff_router_1.router_staff);
// app.use("/api", (req: Request, res: Response) => {
// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
