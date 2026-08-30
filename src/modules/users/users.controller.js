import mongoose from "mongoose";
import * as usersService from "./users.service.js";

export const createUserController = async (req, res, next) => {
    try {
        const userData = { ...req.body };
        if (!userData.password) {
            userData.password = "password123";
        }
        const user = await usersService.createUser(userData);
        res.status(201).json({
            message: "User/Author created successfully",
            user,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUsersController = async (req, res, next) => {
    try {
        const users = await usersService.getAllUsers();
        res.status(200).json({
            count: users.length,
            users,
        });
    } catch (error) {
        next(error);
    }
};

export const getUserByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `Invalid user ID format: ${id}` });
        }
        const user = await usersService.getUserById(id);
        if (!user) {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUserController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `Invalid user ID format: ${id}` });
        }
        const updatedUser = await usersService.updateUser(id, req.body);
        if (!updatedUser) {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUserController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `Invalid user ID format: ${id}` });
        }
        const deletedUser = await usersService.deleteUser(id);
        if (!deletedUser) {
            return res.status(404).json({ message: `User with id ${id} not found` });
        }
        res.status(200).json({
            message: "User deleted successfully",
            user: deletedUser,
        });
    } catch (error) {
        next(error);
    }
};
