"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import orderModel from "@/model/order.model";
import { Types } from "mongoose";


export async function createOrder(formData: FormData) {
  await dbConnect();

  try {
    const rawFormData = {
      userId: new Types.ObjectId(formData.get("userId") as string),
      destinations: JSON.parse(formData.get("destinations") as string),
      totalAmount: parseFloat(formData.get("totalAmount") as string),
      travelDate: new Date(formData.get("travelDate") as string),
      paymentMethod: formData.get("paymentMethod") as string,
      contactInfo: JSON.parse(formData.get("contactInfo") as string),
    };

    const order = new orderModel({
      ...rawFormData,
      status: "pending",
      bookingDate: new Date(),
    });

    await order.save();

    revalidatePath("/orders");
    return { success: true, orderId: order._id.toString() };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getOrders() {
  await dbConnect();

  try {
    const orders = await orderModel
      .find()
      .populate("userId", "name email")
      .populate("destinations.product", "name location price")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function getOrdersByUserId(userId: string) {
  await dbConnect();

  try {
    const orders = await orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate("destinations.product", "name location price image")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
}

export async function getOrderById(orderId: string) {
  await dbConnect();

  try {
    const order = await orderModel
      .findById(orderId)
      .populate("userId", "name email")
      .populate(
        "destinations.product",
        "name location price image description"
      );

    if (!order) {
      return null;
    }

    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "confirmed" | "cancelled"
) {
  await dbConnect();

  try {
    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
    return { success: true, order };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function deleteOrder(orderId: string) {
  await dbConnect();

  try {
    const order = await orderModel.findByIdAndDelete(orderId);

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    revalidatePath("/orders");
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

export async function getOrderStats() {
  await dbConnect();

  try {
    const stats = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          confirmedOrders: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] },
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        cancelledOrders: 0,
      }
    );
  } catch (error) {
    console.error("Error fetching order stats:", error);
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      cancelledOrders: 0,
    };
  }
}
