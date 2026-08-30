import * as usersService from "../users/users.service.js";
import { generateToken } from "../../common/utils/jwt.util.js";

export const register = async (registerData) => {
    const { email } = registerData;
    const existingUser = await usersService.getUserByEmail(email);
    if (existingUser) {
        const error = new Error(`User with email '${email}' already exists.`);
        error.statusCode = 409;
        throw error;
    }

    const user = await usersService.createUser(registerData);
    const token = generateToken({
        userId: user._id,
        role: user.role,
        email: user.email,
    });

    return { user, token };
};

export const login = async (email, password) => {
    const user = await usersService.getUserByEmail(email);
    if (!user) {
        const error = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        const error = new Error("Invalid email or password.");
        error.statusCode = 401;
        throw error;
    }

    const token = generateToken({
        userId: user._id,
        role: user.role,
        email: user.email,
    });

    return { user, token };
};
