import { Document, Model } from "mongoose";
export interface IBuyer extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    role: "buyer" | "admin";
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateToken(): string;
}
export declare const Buyer: Model<IBuyer>;
//# sourceMappingURL=BuyerModel.d.ts.map