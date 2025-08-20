import mongoose, { Schema, Document } from "mongoose";


export interface OrderInput extends Document {
  userId: mongoose.Types.ObjectId;
  destinations: {
    product: mongoose.Types.ObjectId; 
    quantity: number; 
    price: number;
  }[];
  totalAmount: number; 
  status: "pending" | "confirmed" | "cancelled";
  bookingDate: Date;
  travelDate: Date; 
  paymentMethod: "credit-card" | "upi" | "paypal" | "cash";
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    destinations: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    bookingDate: { type: Date, default: Date.now },
    travelDate: { type: Date, required: true },
    paymentMethod: {
      type: String,
      enum: ["credit-card", "upi", "paypal", "cash"],
      required: true,
    },
    contactInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<OrderInput>("Order", OrderSchema);
