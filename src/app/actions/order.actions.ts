"use server";
import { BookingData } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import mongoose, { Types } from "mongoose";
import Order from "@/model/order.model";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendBookingConfirmation } from "@/lib/sendOrder";
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

const toObjectId = (
  id: string | mongoose.Types.ObjectId
): mongoose.Types.ObjectId => {
  if (typeof id === "string") {
    if (mongoose.isValidObjectId(id)) {
      return new mongoose.Types.ObjectId(id);
    }
    const numericId = parseInt(id, 10);
    if (!isNaN(numericId)) {
      const hexString = numericId.toString(16).padStart(24, "0");
      return new mongoose.Types.ObjectId(hexString);
    }
    throw new Error(`Invalid ID format: ${id}`);
  }
  return id;
};

export async function createOrder(formData: BookingData) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Please Login" };
  }

  try {
    if (
      !formData.userId ||
      !formData.trips ||
      !formData.totalAmount ||
      !formData.paymentMethod
    ) {
      return { error: "Missing required fields" };
    }
    const tripsData = JSON.parse(formData.trips);

    const processedTrips = tripsData.map((trip: any) => ({
      ...trip,
      product: toObjectId(trip.product),
      selectedDate: new Date(trip.selectedDate),
      price: trip.price,
      quantity: parseInt(trip.quantity) || 1,
    }));

    const calculatedTotalAmount = parseInt(formData.totalAmount);
    const users = await User.find({ email: session?.user?.email });

    if (!users || users.length === 0) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const user = users[0];
    const userId = user._id;
    const orderData: OrderCreateInput = {
      userId: userId,
      trips: processedTrips,
      totalAmount: calculatedTotalAmount,
      paymentMethod: formData.paymentMethod,
      contactInfo: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
      },
      specialRequests: formData.specialRequests || undefined,
    };
    const order = new Order(orderData);
    await order.save();
    await sendBookingConfirmation(
      formData.email,
      {
        trips: processedTrips,
        totalAmount: calculatedTotalAmount,
      },
      `${formData.firstName} ${formData.lastName}`
    );
    revalidatePath("/orders");
    return { success: true, orderId: order._id.toString() };
  } catch (error) {
    console.error("Create order error:", error);
    return { error: "Failed to create order" };
  }
}

export async function getOrder(orderId: string) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Please Login" };
  }
  try {
    const order = await Order.findById(orderId)
      .populate("userId", "name email")
      .populate("trips.product", "name images");

    if (!order) {
      return { error: "Order not found" };
    }

    return { order: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    return { error: "Failed to fetch order" };
  }
}

export async function getOrdersByUser(email: string, page = 1, limit = 10) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Please Login" };
  }
  try {
    const skip = (page - 1) * limit;

    const users = await User.find({ email });

    if (!users || users.length === 0) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const user = users[0];
    const userId = user._id;
    const orders = await Order.find({ userId })
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate("trips.product", "name images");

    const total = await Order.countDocuments({ userId });

    return {
      success: true,
      orders: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Get user orders error:", error);
    return { error: "Failed to fetch user orders" };
  }
}

export async function getAllOrders(page = 1, limit = 10, status?: string) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Please Login" };
  }
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
      currentPage: page,
    };
  } catch (error) {
    return { error: "Failed to fetch orders" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Please Login" };
  }
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

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: string
) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Please Login" };
  }
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


export async function getOrderStats() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { success: false, error: "Please Login" };
  }
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "₹totalAmount" } } },
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      revenue,
    };
  } catch (error) {
    console.error("Get order stats error:", error);
    return { error: "Failed to fetch order statistics" };
  }
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: "paid" | "refunded",
  paymentId?: string
) {
  await dbConnect();

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus,
        ...(paymentId && { paymentId }), 
      },
      { new: true }
    );

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    return { success: true, order };
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}
