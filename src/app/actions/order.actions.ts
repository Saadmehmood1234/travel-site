"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import mongoose, { Types } from "mongoose";
import Order from "@/model/order.model";
import dbConnect from "@/lib/dbConnect";

export interface OrderCreateInput {
  userId: mongoose.Types.ObjectId | string;
  trips: {
    product: mongoose.Types.ObjectId | string;
    name: string;
    location: string;
    quantity: number;
    price: number;
    selectedDate: Date;
  }[];
  totalAmount: number;
  paymentMethod: "credit-card" | "upi" | "paypal" | "cash";
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  status?: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus?: "unpaid" | "paid" | "refunded";
  bookingDate?: Date;
}

// Helper function to safely convert to ObjectId
const toObjectId = (id: string | mongoose.Types.ObjectId): mongoose.Types.ObjectId => {
  if (typeof id === 'string') {
    // Check if it's already a valid ObjectId
    if (mongoose.isValidObjectId(id)) {
      return new mongoose.Types.ObjectId(id);
    }
    // If it's a numeric string from mock data, create a consistent ObjectId
    // In production, you should only use valid ObjectIds
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      // Create a deterministic ObjectId from numeric ID for mock data
      const hexString = numericId.toString(16).padStart(24, '0');
      return new mongoose.Types.ObjectId(hexString);
    }
    throw new Error(`Invalid ID format: ${id}`);
  }
  return id;
};
import { BookingData } from "@/types";
// Create a new order
// actions/order.actions.ts


export async function createOrder(formData: BookingData) {
  await dbConnect();
  
  try {
    console.log(formData)
    // Check if we have the required data
    if (!formData.userId || !formData.trips || !formData.totalAmount || 
        !formData.paymentMethod) {
      return { error: "Missing required fields" };
    }

    // Parse the trips data
    const tripsData = JSON.parse(formData.trips);
    
    // Convert product IDs to ObjectIds and parse currency values
    const processedTrips = tripsData.map((trip: any) => ({
      ...trip,
      product: toObjectId(trip.product),
      selectedDate: new Date(trip.selectedDate),
      price: trip.price, // Parse the price
      quantity: parseInt(trip.quantity) || 1 // Ensure quantity is a number
    }));

    // Calculate total amount properly
    const calculatedTotalAmount = parseInt(formData.totalAmount)

    const orderData: OrderCreateInput = {
      userId: toObjectId(formData.userId),
      trips: processedTrips,
      totalAmount: calculatedTotalAmount, // Use the calculated amount
      paymentMethod: formData.paymentMethod,
      contactInfo: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone
      },
      specialRequests: formData.specialRequests || undefined,
    };
console.log("Order",orderData,tripsData.totalAmount,"Saad",tripsData)
    const order = new Order(orderData);
    await order.save();
    
    revalidatePath("/orders");
    return { success: true, orderId: order._id.toString() };
  } catch (error) {
    console.error("Create order error:", error);
    return { error: "Failed to create order" };
  }
}
// Get order by ID
export async function getOrder(orderId: string) {
  await dbConnect();
  
  try {
    const order = await Order.findById(orderId)
      .populate("userId", "name email")
      .populate("trips.product", "name images");
    
    if (!order) {
      return { error: "Order not found" };
    }
    
    return { order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.error("Get order error:", error);
    return { error: "Failed to fetch order" };
  }
}

// Get orders by user ID
export async function getOrdersByUser(userId: string, page = 1, limit = 10) {
  await dbConnect();
  
  try {
    const skip = (page - 1) * limit;
    
    const orders = await Order.find({ userId })
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate("trips.product", "name images");
    
    const total = await Order.countDocuments({ userId });
    
    return { 
      orders: JSON.parse(JSON.stringify(orders)), 
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (error) {
    console.error("Get user orders error:", error);
    return { error: "Failed to fetch user orders" };
  }
}

// Get all orders (for admin)
export async function getAllOrders(page = 1, limit = 10, status?: string) {
  await dbConnect();
  
  try {
    const skip = (page - 1) * limit;
    const filter = status ? { status } : {};
    
    const orders = await Order.find(filter)
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email")
      .populate("trips.product", "name");
    
    const total = await Order.countDocuments(filter);
    
    return { 
      orders: JSON.parse(JSON.stringify(orders)), 
      totalPages: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (error) {
    console.error("Get all orders error:", error);
    return { error: "Failed to fetch orders" };
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  await dbConnect();
  
  try {
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return { error: "Invalid status" };
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    
    if (!order) {
      return { error: "Order not found" };
    }
    
    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
    return { success: true, order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.error("Update order status error:", error);
    return { error: "Failed to update order status" };
  }
}

// Update payment status
export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  await dbConnect();
  
  try {
    const validStatuses = ["unpaid", "paid", "refunded"];
    if (!validStatuses.includes(paymentStatus)) {
      return { error: "Invalid payment status" };
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true }
    );
    
    if (!order) {
      return { error: "Order not found" };
    }
    
    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
    return { success: true, order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    console.error("Update payment status error:", error);
    return { error: "Failed to update payment status" };
  }
}

// Delete order
export async function deleteOrder(orderId: string) {
  await dbConnect();
  
  try {
    const order = await Order.findByIdAndDelete(orderId);
    
    if (!order) {
      return { error: "Order not found" };
    }
    
    revalidatePath("/orders");
    return { success: true };
  } catch (error) {
    console.error("Delete order error:", error);
    return { error: "Failed to delete order" };
  }
}

// Send order confirmation email
export async function sendOrderConfirmation(orderId: string) {
  await dbConnect();
  
  try {
    const order = await Order.findById(orderId)
      .populate("userId", "name email")
      .populate("trips.product", "name");
    
    if (!order) {
      return { error: "Order not found" };
    }
    
    // In a real application, you would integrate with an email service
    // like Resend, SendGrid, or Nodemailer here
    console.log("Sending confirmation email for order:", orderId);
    console.log("To:", order.contactInfo.email);
    console.log("Order details:", {
      orderId: order._id,
      customer: order.contactInfo.name,
      trips: order.trips,
      totalAmount: order.totalAmount
    });
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, message: "Confirmation email sent successfully" };
  } catch (error) {
    console.error("Send confirmation error:", error);
    return { error: "Failed to send confirmation email" };
  }
}

// Get order statistics
export async function getOrderStats() {
  await dbConnect();
  
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    
    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
    
    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      revenue
    };
  } catch (error) {
    console.error("Get order stats error:", error);
    return { error: "Failed to fetch order statistics" };
  }
}