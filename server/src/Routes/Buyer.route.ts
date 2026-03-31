import express from "express";
import { validate } from "../Middleware/validateMiddleware.js";
import { buyerLoginValidator, buyerRegistrationValidator } from "../validators/buyer.validator.js";
import { buyer_me, buyerLogin, buyerLogout, buyerRegistration, RefreshToken } from "../Controller/Buyer.controller.js";
import { isAuthenticated } from "../Middleware/authMiddleware.js";

export const BuyerRouter = express.Router();

BuyerRouter.post("/register", validate(buyerRegistrationValidator), buyerRegistration);
BuyerRouter.post("/login", validate(buyerLoginValidator), buyerLogin);
BuyerRouter.get("/me", isAuthenticated, buyer_me);
BuyerRouter.post("/logout", isAuthenticated, buyerLogout);
BuyerRouter.get("/refresh-token", RefreshToken)
