import { verifyToken } from "../utils/jwt.util.js";
import User from "../../modules/users/schemas/user.schema.js";

export const AuthGuard = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required. Please provide a Bearer token in Authorization header.",
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Authentication token missing." });
        }

        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (jwtError) {
            if (jwtError.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token has expired. Please login again." });
            }
            return res.status(401).json({ message: "Invalid authentication token." });
        }

        const user = await User.findById(decoded.userId || decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User belonging to this token no longer exists." });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
