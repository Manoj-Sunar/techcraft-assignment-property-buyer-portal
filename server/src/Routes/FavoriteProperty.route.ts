

import express from "express";
import { isAuthenticated } from "../Middleware/authMiddleware.js";
import { FavoriteProperty, getBuyerFavoriteProperty, UnFavoriteProperty } from "../Controller/favorite.controller.js";



export const favoritePropertyRouter = express.Router();

favoritePropertyRouter.post("/:propertyId", isAuthenticated, FavoriteProperty);
favoritePropertyRouter.get("/favorite-property", isAuthenticated, getBuyerFavoriteProperty);
favoritePropertyRouter.delete("/unfavorite/:propertyId", isAuthenticated, UnFavoriteProperty);