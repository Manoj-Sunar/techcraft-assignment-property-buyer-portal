import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { StatusCodes } from "../utils/statusCode.js";
import jwt from "jsonwebtoken";
import { Buyer } from "../Model/BuyerModel.js";

interface AuthRequest extends Request {
  user?: any;
}

export const isAuthenticated = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1] || req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "No access token provided");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await Buyer.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
    }

    req.user = user;
    next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Access token expired");
    }
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
  }
};