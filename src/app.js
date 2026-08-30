import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./modules/auth/auth.routes.js";
import booksRouter from "./modules/books/books.routes.js";
import usersRouter from "./modules/users/users.routes.js";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Auth Routes (Supports both top-level /register, /login and /auth/register, /auth/login)
app.use("/", authRouter);
app.use("/auth", authRouter);

// Module Routers
app.use("/books", booksRouter);
app.use("/users", usersRouter);
app.use("/authors", usersRouter);

// Root Welcome Endpoint
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Book Store API 📚",
        endpoints: {
            auth: {
                register: "POST /register or POST /auth/register",
                login: "POST /login or POST /auth/login",
            },
            books: "/books",
            users: "/users",
            about: "/about",
        },
    });
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "about.html"));
});

// 404 Route Handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global Exception Filter
app.use(HttpExceptionFilter);

export default app;
