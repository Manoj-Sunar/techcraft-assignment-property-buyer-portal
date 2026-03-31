import mongoose, { Schema, Document, Model } from "mongoose";

// 1️⃣ Define TypeScript interface
export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  type: "apartment" | "villa" | "house" | "land";
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  images: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2️⃣ Create Mongoose Schema
const propertySchema: Schema<IProperty> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Property description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Property price is required"],
    },
    location: {
      city: { type: String, required: true },
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    type: {
      type: String,
      enum: ["apartment", "villa", "house", "land"],
      required: true,
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    areaSqFt: { type: Number, required: true },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// 3️⃣ Export Model
const Property: Model<IProperty> = mongoose.model<IProperty>("Property", propertySchema);
export default Property;