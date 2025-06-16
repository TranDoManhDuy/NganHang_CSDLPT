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
exports.closeDB = exports.connectDB = void 0;
const mssql_1 = __importDefault(require("mssql"));
const env_1 = require("./env");
let pool = null;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    // Load environment variables from .env file
    try {
        if (pool) {
            console.log("Using existing connection pool.");
            return pool;
        }
        pool = yield mssql_1.default.connect(env_1.dbConfig);
        console.log("Connected to database.");
        return pool;
    }
    catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
});
exports.connectDB = connectDB;
const closeDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (pool) {
            yield pool.close();
            console.log("Database connection closed.");
        }
    }
    catch (error) {
        console.error("Error closing database connection:", error);
    }
    finally {
        pool = null; // Reset the pool to null after closing
    }
});
exports.closeDB = closeDB;
