"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router_auth = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router_auth = (0, express_1.Router)();
exports.router_auth = router_auth;
router_auth.post('/login', auth_controller_1.login);
router_auth.get('/refreshAccessToken', auth_controller_1.refreshAccessToken);
router_auth.get('/logout', auth_middleware_1.authenticateToken, auth_controller_1.logout);
router_auth.get('/verifyAccessToken', auth_middleware_1.authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Token is valid', success: true });
});
