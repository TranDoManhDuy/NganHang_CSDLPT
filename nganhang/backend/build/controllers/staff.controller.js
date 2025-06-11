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
exports.getAStaff = exports.putStaff = exports.postStaff = exports.getAllStaff = void 0;
const executeQuery_1 = require("../services/executeQuery");
const mssql_1 = __importDefault(require("mssql"));
const getAllStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
          EXECUTE [dbo].[xem_toan_bo_nhan_vien] 
          `;
        const result = yield (0, executeQuery_1.executeQuery)(query, []);
        res.status(200).json({
            message: "Get all staff successfully",
            data: result,
        });
    }
    catch (error) {
        console.error("Error log all staff: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllStaff = getAllStaff;
const postStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { MANV, HO, TEN, CMND, DIACHI, PHAI, SODT, MACN } = req.body;
        const query = `
        EXECUTE [dbo].[them_nhan_vien] 
            @MANV
            ,@HO
            ,@TEN
            ,@CMND
            ,@DIACHI
            ,@PHAI
            ,@SODT
            ,@MACN
        `;
        const params = [
            { name: "MANV", type: mssql_1.default.NChar(10), value: MANV },
            { name: "HO", type: mssql_1.default.NVarChar(40), value: HO },
            { name: "TEN", type: mssql_1.default.NVarChar(10), value: TEN },
            { name: "CMND", type: mssql_1.default.NChar(10), value: CMND },
            { name: "DIACHI", type: mssql_1.default.NVarChar(100), value: DIACHI },
            { name: "PHAI", type: mssql_1.default.NVarChar(3), value: PHAI },
            { name: "SODT", type: mssql_1.default.NVarChar(15), value: SODT },
            { name: "MACN", type: mssql_1.default.NChar(10), value: MACN },
        ];
        const result = yield (0, executeQuery_1.executeQuery)(query, params);
        if (((_a = result[0]) === null || _a === void 0 ? void 0 : _a.code) == 0) {
            res.status(200).json({ message: result[0].message, success: true });
        }
        else if (((_b = result[0]) === null || _b === void 0 ? void 0 : _b.code) != 0) {
            res.status(400).json({ message: result[0].message, success: false });
        }
        else {
            res.status(500).json({ message: "Unexpected error", success: false });
        }
    }
    catch (error) {
        console.error("Error creating staff:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.postStaff = postStaff;
const putStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { MANV, HO, TEN, CMND, DIACHI, PHAI, SODT, MACN, TrangThaiXoa } = req.body;
        const query = `
        EXECUTE [dbo].[sua_nhan_vien] 
            @MANV
            ,@HO
            ,@TEN
            ,@CMND
            ,@DIACHI
            ,@PHAI
            ,@SODT
            ,@MACN
            ,@TrangThaiXoa
      `;
        const params = [
            { name: "MANV", type: mssql_1.default.NChar(10), value: MANV },
            { name: "HO", type: mssql_1.default.NVarChar(40), value: HO },
            { name: "TEN", type: mssql_1.default.NVarChar(10), value: TEN },
            { name: "CMND", type: mssql_1.default.NChar(10), value: CMND },
            { name: "DIACHI", type: mssql_1.default.NVarChar(100), value: DIACHI },
            { name: "PHAI", type: mssql_1.default.NVarChar(3), value: PHAI },
            { name: "SODT", type: mssql_1.default.NVarChar(15), value: SODT },
            { name: "MACN", type: mssql_1.default.NChar(10), value: MACN },
            { name: "TrangThaiXoa", type: mssql_1.default.Int, value: TrangThaiXoa }
        ];
        const result = yield (0, executeQuery_1.executeQuery)(query, params);
        if (((_a = result[0]) === null || _a === void 0 ? void 0 : _a.code) == 0) {
            res.status(200).json({ message: result[0].message, success: true });
        }
        else if (((_b = result[0]) === null || _b === void 0 ? void 0 : _b.code) != 0) {
            res.status(400).json({ message: result[0].message, success: false });
        }
        else {
            res.status(500).json({ message: "Unexpected error", success: false });
        }
    }
    catch (error) {
        console.error("Error updating staff:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.putStaff = putStaff;
const getAStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { MANV } = req.body;
        const query = `
        EXECUTE [dbo].[xem_mot_nhan_vien] 
            @MANV
      `;
        const params = [
            { name: "MANV", type: mssql_1.default.NChar(10), value: MANV }
        ];
        const result = yield (0, executeQuery_1.executeQuery)(query, params);
        if (result[0]) {
            res.status(200).json({ message: result[0], success: true });
        }
        else {
            res.status(500).json({ message: "Unexpected error", success: false });
        }
    }
    catch (error) {
        console.error("Error updating staff:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAStaff = getAStaff;
