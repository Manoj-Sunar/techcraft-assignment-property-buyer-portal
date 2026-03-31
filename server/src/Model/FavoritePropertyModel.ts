import mongoose, { Schema, Types, Document } from "mongoose";

export interface IFavoriteProperty extends Document {
  property: Types.ObjectId;
  buyer: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoritePropertySchema = new Schema<IFavoriteProperty>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    buyer: {
      type: Schema.Types.ObjectId,
      ref: "Buyer",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


// Prevent duplicate favorites (VERY IMPORTANT)
favoritePropertySchema.index({ property: 1, buyer: 1 }, { unique: true });

export default mongoose.model<IFavoriteProperty>(
  "FavoriteProperty",
  favoritePropertySchema
);