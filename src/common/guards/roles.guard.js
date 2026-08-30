export const RolesGuard = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Authentication required." });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Forbidden: Access restricted to [${roles.join(", ")}]. Current role is '${req.user.role}'.`,
            });
        }

        next();
    };
};
