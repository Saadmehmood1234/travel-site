import mongoose, { model, models } from "mongoose";

export const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    requiredt: true,
  },
});

export const Subscriber =
  models?.Subscriber || model("Subscriber", subscriberSchema);
