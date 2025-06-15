"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomer = exports.postCustomer = exports.getAlCustomer = exports.getInfoCustomer = void 0;
const executeQuery_1 = require("../services/executeQuery");
const mssql_1 = __importDefault(require("mssql"));
const getInfoCustomer = (req, res) => { };
exports.getInfoCustomer = getInfoCustomer;
const getAlCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
        SELECT TOP (1000) [CMND]
                ,[HO]
                ,[TEN]
                ,[DIACHI]
                ,[PHAI]
                ,[NGAYCAP]
                ,[SODT]
                ,[MACN]
                FROM [NGANHANG].[dbo].[KhachHang]`;
        const result = yield (0, executeQuery_1.executeQuery)(query, []);
        res.status(200).json({
            message: "Get all customer successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error fetching branches:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAlCustomer = getAlCustomer;
const postCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { CMND, HO, TEN, DIACHI, PHAI, SODT, MACN } = req.body;
        const query = `
      EXECUTE [dbo].[sp_them_khach_hang] 
          @CMND
          ,@HO
          ,@TEN
          ,@DIACHI
          ,@PHAI
          ,@SODT
          ,@MACN`;
        const params = [
            { name: "CMND", type: mssql_1.default.NChar(10), value: CMND },
            { name: "HO", type: mssql_1.default.NVarChar(50), value: HO },
            { name: "TEN", type: mssql_1.default.NVarChar(50), value: TEN },
            { name: "DIACHI", type: mssql_1.default.NVarChar(100), value: DIACHI },
            { name: "PHAI", type: mssql_1.default.NVarChar(3), value: PHAI },
            { name: "SODT", type: mssql_1.default.NVarChar(15), value: SODT },
            { name: "MACN", type: mssql_1.default.NChar(10), value: MACN },
        ];
        var result = yield (0, executeQuery_1.executeQuery)(query, params);
        if (result[0].Result != undefined) {
            res.status(200).json({ message: result[0].Result, success: true });
            return;
        }
        if (result[0].ErrorMessage != undefined) {
            res.status(401).json({ message: result[0].ErrorMessage, success: false });
            return;
        }
    }
    catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ error: error });
    }
});
exports.postCustomer = postCustomer;
const updateCustomer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { CMND, HO, TEN, DIACHI, PHAI, SODT } = req.body;
        const query = `
      EXECUTE [dbo].[sp_sua_khach_hang] 
          @CMND
          ,@HO
          ,@TEN
          ,@DIACHI
          ,@PHAI
          ,@SODT`;
        const params = [
            { name: "CMND", type: mssql_1.default.NChar(10), value: CMND },
            { name: "HO", type: mssql_1.default.NVarChar(50), value: HO },
            { name: "TEN", type: mssql_1.default.NVarChar(50), value: TEN },
            { name: "DIACHI", type: mssql_1.default.NVarChar(100), value: DIACHI },
            { name: "PHAI", type: mssql_1.default.NVarChar(3), value: PHAI },
            { name: "SODT", type: mssql_1.default.NVarChar(15), value: SODT },
        ];
        var result = yield (0, executeQuery_1.executeQuery)(query, params);
        if (result[0].Result != undefined) {
            res.status(200).json({ message: result[0].Result, success: true });
            return;
        }
        if (result[0].ErrorMessage != undefined) {
            res.status(401).json({ message: result[0].ErrorMessage, success: false });
            return;
        }
    }
    catch (error) {
        console.error("Error creating customer:", error);
        res.status(500).json({ error: error });
    }
});
exports.updateCustomer = updateCustomer;
