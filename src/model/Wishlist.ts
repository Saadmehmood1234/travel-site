// model/Wishlist.ts
import { Schema, model, models } from "mongoose";

export const wishlistSchema = new Schema(
  {
    customerId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product", 
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