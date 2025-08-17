
import mongoose, { model, models } from "mongoose";

export const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, 
    unique: true,   
    trim: true,    
    lowercase: true 
  },
});

export const TravelSubscriber =
  models?.TravelSubscriber || model("TravelSubscriber", subscriberSchema);
