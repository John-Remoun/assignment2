import { resolve } from "node:path";
import { config } from "dotenv";

export const NODE_ENV = process.env.NODE_ENV || "development";

const envPath = {
    development: ".env.development",
    production: ".env.production",
};

config({
    path: resolve(`./config/${envPath[NODE_ENV]}`),
});

export const PORT = process.env.PORT ?? 7000;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookstore";
export const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey_bookstore_2026";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
