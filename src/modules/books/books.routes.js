import { Router } from "express";
import {
    getAllBooksController,
    getBookByIdController,
    createBookController,
    updateBookController,
    deleteBookController,
} from "./books.controller.js";
import { AuthGuard } from "../../common/guards/auth.guard.js";
import { RolesGuard } from "../../common/guards/roles.guard.js";

const booksRouter = Router();

// Public routes
booksRouter.get("/", getAllBooksController);
booksRouter.get("/:id", getBookByIdController);

// Protected routes (Any authenticated user)
booksRouter.post("/", AuthGuard, createBookController);
booksRouter.put("/:id", AuthGuard, updateBookController);
booksRouter.patch("/:id", AuthGuard, updateBookController);

// Protected Admin-only route
booksRouter.delete("/:id", AuthGuard, RolesGuard("admin"), deleteBookController);

export default booksRouter;
