import { StatusCodes } from "../utils/statusCode.js";
export const validate = (validator) => (req, res, next) => {
    const errorMessage = validator(req.body);
    if (errorMessage) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: errorMessage });
    }
    next();
};
//# sourceMappingURL=validateMiddleware.js.map