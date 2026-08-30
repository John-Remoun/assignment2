import mongoose from "mongoose";
import { MONGO_URI } from "../config/config.service.js";

export const connectDatabase = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host} / ${conn.connection.name} 📦🍃`);
        return conn;
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected ⚠️");
});

mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected 🔄");
});
