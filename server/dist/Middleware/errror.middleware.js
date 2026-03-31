import { StatusCodes } from "../utils/statusCode.js";
import { ApiError } from "../utils/ApiError.js";
export const errorHandler = (err, req, res, next) => {
    let statusCode = StatusCodes.SERVER_ERROR;
    let message = "Something went wrong";
    // ✅ Known error (our custom error)
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // ❌ Mongoose / validation errors (optional handling)
    if (err.name === "ValidationError") {
        statusCode = StatusCodes.BAD_REQUEST;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
    }
    // 🔐 Production vs Development
    const response = {
        success: false,
        message,
    };
    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }
    res.status(statusCode).json(response);
};
//# sourceMappingURL=errror.middleware.js.map