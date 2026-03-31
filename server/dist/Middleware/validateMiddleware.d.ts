import type { NextFunction, Request, Response } from "express";
type ValidatorFn = (body: any) => string | null;
export declare const validate: (validator: ValidatorFn) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=validateMiddleware.d.ts.map