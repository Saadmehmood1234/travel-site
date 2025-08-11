"use server";
import { dbConnect } from "@/lib/dbConnect";
import { TravelSubscriber } from "@/model/Subscriber";

export const subscribeActions = async (email: string) => {
  if (!email) {
    return {
      success: false,
      message: "Email is required",
    };
  }
  
  try {
    await dbConnect()
    const existingSubscriber = await TravelSubscriber.findOne({ email });

    if (existingSubscriber) {
      return {
        success: false,
        message: "You are already subscribed",
      };
    }

    const newSubscriber = await TravelSubscriber.create({ email });

    return {
      success: true,
      message: "Subscription successful",
      data: newSubscriber,
    };
  } catch (error) {
    console.error("Error subscribing:", error);
    return {
      success: false,
      message: "An error occurred while subscribing",
    };
  }
};
