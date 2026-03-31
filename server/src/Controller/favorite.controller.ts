import type { Request, Response } from "express";
import mongoose from "mongoose";
import { asyncHandler } from "../Middleware/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { StatusCodes } from "../utils/statusCode.js";
import { Messages } from "../utils/message.js";
import FavoritePropertyModel from "../Model/FavoritePropertyModel.js";

// ✅ Proper Params typing
interface Params {
    propertyId: string;
}

interface AuthRequest extends Request<Params> {
    user: any;
}

export const FavoriteProperty = asyncHandler(
    async (req: AuthRequest, res: Response) => {

        const { propertyId } = req.params;

        // ❌ 1. Auth check
        if (!req.user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, Messages.UNAUTHORIZED);
        }

        // ❌ 2. Validate propertyId
        if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid property ID");
        }

        const propertyObjectId = new mongoose.Types.ObjectId(propertyId);

        // ❌ 3. Check duplicate
        const existingFavoriteProperty = await FavoritePropertyModel.findOne({
            buyer: req.user._id,
            property: propertyObjectId,
        });

        if (existingFavoriteProperty) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "Property already in favorites"
            );
        }

        // ✅ 4. Create favorite
        const favoritePropertyCreated = await FavoritePropertyModel.create({
            buyer: req.user._id,
            property: propertyObjectId,
        });

        // ✅ 5. Response (IMPORTANT)
        res.status(201).json({
            success: true,
            message: "Property added to favorites",
            data: favoritePropertyCreated,
        });
    }
);




export const UnFavoriteProperty = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        const { propertyId } = req.params;


        

        // ❌ 1. Auth check
        if (!req.user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, Messages.UNAUTHORIZED);
        }

        // ❌ 2. Validate propertyId
        if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid property ID");
        }

        const propertyObjectId = new mongoose.Types.ObjectId(propertyId);

        // ❌ 3. Find and delete (atomic operation)
        const deletedFavorite = await FavoritePropertyModel.findOneAndDelete({
            buyer: req.user._id,
            property: propertyObjectId,
        });

        if (!deletedFavorite) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Favorite property not found"
            );
        }

        // ✅ 4. Success response
        res.status(200).json({
            success: true,
            message: "Property removed from favorites",
            data: deletedFavorite,
        });
    }
);


// ☑️get all favorite property only login buyer can get his own favorite property not others buyer
export const getBuyerFavoriteProperty = asyncHandler(
    async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            throw new ApiError(
                StatusCodes.UNAUTHORIZED,
                Messages.UNAUTHORIZED + " Login first"
            );
        }

        const favorites = await FavoritePropertyModel.find({
            buyer: req.user._id,
        })
            .populate({
                path: "property",
                select:
                    "title description price location type bedrooms bathrooms areaSqFt images isAvailable",
            })
            .select("-buyer")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: favorites.length,
            data: favorites,
        });
    }
);