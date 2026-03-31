import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, {} from "jsonwebtoken";
import ms from "ms";
// Schema
const BuyerSchema = new mongoose.Schema({
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
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["buyer", "admin"], default: "buyer" },
}, { timestamps: true, versionKey: false });
//  password hashing before saving
BuyerSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
// ✅ Generate JWT token (TS-safe)
BuyerSchema.methods.generateToken = function () {
    const payload = { id: this._id, email: this.email, role: this.role };
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error("JWT_SECRET not defined");
    const expiresRaw = process.env.JWT_EXPIRES_IN ?? "15m";
    const expiresIn = expiresRaw;
    const options = { expiresIn };
    return jwt.sign(payload, secret, options);
};
// Compare password
BuyerSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
// Export Buyer model
export const Buyer = mongoose.models.Buyer || mongoose.model("Buyer", BuyerSchema);
//# sourceMappingURL=BuyerModel.js.map