import { Router } from "express";
import {
    createUserController,
    getAllUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
} from "./users.controller.js";

const usersRouter = Router();

usersRouter.post("/", createUserController);
usersRouter.get("/", getAllUsersController);
usersRouter.get("/:id", getUserByIdController);
usersRouter.put("/:id", updateUserController);
usersRouter.delete("/:id", deleteUserController);

export default usersRouter;
