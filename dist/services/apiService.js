"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const axios_1 = __importDefault(require("axios"));
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.efizion-factory.com';
const authenticate = async (apiKey) => {
    try {
        const response = await axios_1.default.get(`${API_BASE_URL}/auth`, {
            headers: { 'x-api-key': apiKey },
        });
        return response.data;
    }
    catch (error) {
        throw new Error('Authentication failed. Please check your API key.');
    }
};
exports.authenticate = authenticate;
//# sourceMappingURL=apiService.js.map