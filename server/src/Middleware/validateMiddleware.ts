import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "../utils/statusCode.js";



type ValidatorFn = (body: any) => string | null;

export const validate =
  (validator: ValidatorFn) => (req: Request, res: Response, next: NextFunction) => {
    const errorMessage = validator(req.body);
    if (errorMessage) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: errorMessage });
    }
    next();
  };