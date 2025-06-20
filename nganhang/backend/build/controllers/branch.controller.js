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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBranchCurrent = void 0;
const executeQuery_1 = require("../services/executeQuery");
const getBranchCurrent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = `
        SELECT [MACN]
                ,[TENCN]
        FROM [NGANHANG].[dbo].[ChiNhanh] 
        `;
        const result = yield (0, executeQuery_1.executeQuery)(query, []);
        res.status(200).json({
            message: "Get all branch successfully",
            data: result,
        });
        console.log("Get all branch successfully");
    }
    catch (error) {
        console.error("Error fetching branches:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getBranchCurrent = getBranchCurrent;
