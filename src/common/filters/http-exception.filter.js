import { NODE_ENV } from "../../config/config.service.js";

export const HttpExceptionFilter = (error, req, res, next) => {
    let statusCode = error.cause?.status || error.statusCode || 500;
    let errorMessage = error.message || "Something went wrong";
    let details = undefined;

    // Handle Mongoose Validation Error
    if (error.name === "ValidationError") {
        statusCode = 400;
        errorMessage = "Validation Error";
        details = Object.values(error.errors).map((err) => err.message);
    }

    // Handle Mongoose CastError (e.g. invalid ObjectId)
    if (error.name === "CastError") {
        statusCode = 400;
        errorMessage = `Invalid format for field '${error.path}': ${error.value}`;
    }

    // Handle MongoDB Duplicate Key Error (E11000)
    if (error.code === 11000) {
        statusCode = 409;
        const field = Object.keys(error.keyValue || {})[0] || "field";
        errorMessage = `Duplicate value '${error.keyValue?.[field]}' for ${field}. It must be unique.`;
    }

    res.status(statusCode).json({
        error_message: errorMessage,
        ...(details && { errors: details }),
        stack: NODE_ENV === "development" ? error.stack : undefined,
    });
};
