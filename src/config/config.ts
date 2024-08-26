import { config } from "dotenv";
config();

export const envConfig = {
    JWT_SECRET: process.env.JWT_SECRET || "chatbot-app-scerectKey",
    KEY_M: process.env.KEY_M || ""
} 