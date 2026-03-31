// src/controllers/buyer.controller.ts
import type { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { ApiError } from "../utils/ApiError.js";
import { StatusCodes } from "../utils/statusCode.js";
import { asyncHandler } from "../Middleware/asyncHandler.js";
import { Buyer } from "../Model/BuyerModel.js";
import { Messages } from "../utils/message.js";




// -------------------- Helper functions --------------------
const createAccessToken = (userId: string) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "15m" });


const createRefreshToken = (userId: string) =>
    jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });


const hashToken = (token: string) =>
    crypto.createHash("sha256").update(token).digest("hex");


const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};




// -------------------- Buyer Registration --------------------
export const buyerRegistration = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // 1️⃣ Check if email exists
    if (await Buyer.findOne({ email })) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Email already registered");
    }

    // 2️⃣ Create buyer
    const buyer = await Buyer.create({ name, email, password });

    // 3️⃣ Generate tokens
    const accessToken = createAccessToken(buyer._id.toString());
    const refreshToken = createRefreshToken(buyer._id.toString());

    // 4️⃣ Hash refresh token and save in DB
    buyer.refreshToken = hashToken(refreshToken);
    await buyer.save();

    // 5️⃣ Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });


    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 min
    });

    res.status(StatusCodes.OK).json({
        success: true,
        data: {
            buyer: {
                id: buyer._id,
                name: buyer.name,
                email: buyer.email,
                role: buyer.role,
            },
        },
    });

});






// -------------------- Buyer Login --------------------
export const buyerLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const buyer = await Buyer.findOne({ email }).select("+password");
    if (!buyer || !(await buyer.comparePassword(password))) {
        throw new ApiError(StatusCodes.BAD_REQUEST, Messages.INVALID_CREDENTIALS);
    }

    // Generate tokens
    const accessToken = createAccessToken(buyer._id.toString());
    const refreshToken = createRefreshToken(buyer._id.toString());

    // Save hashed refresh token
    buyer.refreshToken = hashToken(refreshToken);
    await buyer.save();

    buyer.password = undefined as any;

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 min
    });

    res.status(StatusCodes.OK).json({
        success: true,
        data: {
            buyer: {
                id: buyer._id,
                name: buyer.name,
                email: buyer.email,
                role: buyer.role,
            },
        },
    });


});






// -------------------- Refresh Token --------------------
export const RefreshToken = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;
    if (!token) throw new ApiError(StatusCodes.UNAUTHORIZED, "No refresh token");

    const hashedToken = hashToken(token);

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as { id: string };

    const user = await Buyer.findOne({ _id: decoded.id, refreshToken: hashedToken }).select("-password");
    if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");

    // Generate new access token
    const newAccessToken = createAccessToken(user._id.toString());

    res.cookie("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(StatusCodes.OK).json({ success: true, accessToken: newAccessToken });
});




// -------------------- Get Current Buyer --------------------
export const buyer_me = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user; // from middleware
    if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, Messages.UNAUTHORIZED);

    res.status(StatusCodes.OK).json({
        success: true,
        data: {
            buyer: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
        },
    });
});




// -------------------- Logout (optional) --------------------
export const buyerLogout = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user) throw new ApiError(StatusCodes.UNAUTHORIZED, Messages.UNAUTHORIZED);

    // Remove refresh token in DB
    user.refreshToken = undefined;
    await user.save();

    // Clear cookies
    res.clearCookie("refreshToken", cookieOptions);
    res.clearCookie("accessToken", cookieOptions);

    res.status(StatusCodes.OK).json({ success: true, message: "Logged out successfully" });
});