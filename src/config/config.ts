import { config } from "dotenv";
config();

export const envConfig = {
    JWT_SECRET: process.env.JWT_SECRET,
    KEY_M: process.env.KEY_M || ""
} 