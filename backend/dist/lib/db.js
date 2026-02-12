"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
let cachedConnection = null;
async function connectDB() {
    if (cachedConnection) {
        return cachedConnection;
    }
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }
    const opts = {
        bufferCommands: false,
    };
    try {
        cachedConnection = await mongoose_1.default.connect(mongoUri, opts);
        return cachedConnection;
    }
    catch (e) {
        cachedConnection = null;
        throw e;
    }
}
exports.default = connectDB;
