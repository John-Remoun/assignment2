import * as authService from "./auth.service.js";

export const registerController = async (req, res, next) => {
    try {
        const { name, email, password, role, bio, age } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required for registration.",
            });
        }

        const { user, token } = await authService.register({
            name,
            email,
            password,
            role,
            bio,
            age,
        });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user,
        });
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required to login.",
            });
        }

        const { user, token } = await authService.login(email, password);

        res.status(200).json({
            message: "Login successful",
            token,
            user,
        });
    } catch (error) {
        next(error);
    }
};
