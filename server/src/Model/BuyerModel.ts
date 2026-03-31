import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import ms from "ms"



export interface IBuyer extends Document {
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    role: "buyer" | "admin";
    refreshToken: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateToken(): string;
    generateRefreshToken(): string;
}


// Schema
const BuyerSchema = new mongoose.Schema<IBuyer>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters"],
            select: false,
        },
        refreshToken: {
            type: String,
            select: false,
            default: null,
        },
        isVerified: { type: Boolean, default: false },
        role: { type: String, enum: ["buyer", "admin"], default: "buyer" },
    },
    { timestamps: true, versionKey: false }
);




//  password hashing before saving
BuyerSchema.pre("save", async function (this: IBuyer) {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});




// ✅ Generate JWT token (TS-safe) it is a accesss token
BuyerSchema.methods.generateToken = function (this: IBuyer): string {
    const payload = { id: this._id, email: this.email, role: this.role };

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not defined");


    const expiresRaw: string = process.env.JWT_EXPIRES_IN ?? "15m";
    const expiresIn: ms.StringValue = expiresRaw as ms.StringValue;

    const options: SignOptions = { expiresIn };

    return jwt.sign(payload, secret, options);
};



// ☑️ it is a refresh token which is live long like 7d-30d
BuyerSchema.methods.generateRefreshToken = function (this: IBuyer) {
    const payload = { id: this._id, email: this.email, role: this.role };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const expiresRaw: string = process.env.REFRESH_TOKEN_EXPIRES_IN ?? "7d";
    const expiresIn: ms.StringValue = expiresRaw as ms.StringValue;
    return jwt.sign(payload, secret!, { expiresIn });
};



// Compare password
BuyerSchema.methods.comparePassword = async function (
    candidatePassword: string
) {
    return bcrypt.compare(candidatePassword, this.password);
};




// Export Buyer model
export const Buyer: Model<IBuyer> =
    mongoose.models.Buyer || mongoose.model<IBuyer>("Buyer", BuyerSchema);