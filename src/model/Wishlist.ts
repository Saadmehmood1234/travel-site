// model/Wishlist.ts
import { Schema, model, models } from "mongoose";

export const wishlistSchema = new Schema(
  {
    customerId: {
      type: String, // Changed from ObjectId to String
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Destination", 
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Wishlist =
  models?.Wishlist || model("Wishlist", wishlistSchema);