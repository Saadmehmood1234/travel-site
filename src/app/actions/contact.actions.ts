"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TravelContactForm from "@/model/Contact";
import { ContactFormType } from "@/lib/types";
import dbConnect from "@/lib/dbConnect";

export const contactUs = async (data: ContactFormType) => {
  const { name, email, phone, subject, message, travelType } = data;
  if (!name || !email || !message || !travelType || !subject) {
    return {
      success: false,
      message: "All fields are required",
    };
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { success: false, message: "Signin to continue", status: 401 };
  }

  try {
    await dbConnect();

    const contactForm = new TravelContactForm({
      name,
      email,
      phone,
      subject,
      message,
      travelType,
    });

    await contactForm.save();

    return { success: true, message: "Message Sent Successfully" };
  } catch (error) {
    console.error("Error saving contact form:", error);
    return {
      success: false,
      message: "Failed to send message",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
