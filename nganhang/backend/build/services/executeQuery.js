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
exports.executeQuery = void 0;
const database_1 = require("../config/database");
const executeQuery = (query, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield (0, database_1.connectDB)();
        const request = pool.request();
        params.forEach((param) => {
            request.input(param.name, param.type, param.value);
        });
        const result = yield request.query(query);
        return result.recordset;
    }
    catch (error) {
        console.error("Error executing query:", error);
        throw error;
    }
});
exports.executeQuery = executeQuery;
