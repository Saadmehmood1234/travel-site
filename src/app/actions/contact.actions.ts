"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TravelContactForm from "@/model/Contact";
import { ContactFormType } from "@/lib/types";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";

// Add Zod schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  travelType: z.string().min(1, "Please select a travel type") // Simplified enum validation
});

export const contactUs = async (data: ContactFormType) => {
  try {
    contactFormSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Use issues instead of errors
      return {
        success: false,
        message: error.issues[0].message,
      };
    }
    return {
      success: false,
      message: "Invalid form data",
    };
  }
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { success: false, message: "Signin to continue", status: 401 };
  }

  try {
    await dbConnect();

    const contactForm = new TravelContactForm({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      travelType: data.travelType,
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