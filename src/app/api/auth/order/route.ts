import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { DarkUser } from "@/model/User";
import { Order } from "@/model/Order";
import { sendOrderConfirmationEmail } from "@/utils/sendOrderEmail";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data: any = await req.json();

    // Validate input data
    if (!data || data.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Product is not ordered",
      });
    }

    if (!data.user) {
      return NextResponse.json({
        success: false,
        message: "User is not found",
      });
    }

    const user = await DarkUser.findOne({ email: data.user.email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User is not found",
      });
    }
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000); 

    const recentOrder = await Order.findOne({
      ownerId: user._id,
      "products.productId": data.items[0]._id,
      createdAt: { $gte: oneMinuteAgo },
    });

    if (recentOrder) {
      return NextResponse.json({
        success: false,
        message:
          "You've already ordered this product recently. Please wait 1 minute to  ordering again.",
      });
    }

    const products = data.items.map((p: any) => {
      return {
        productId: p._id,
        quantity: p.quantity,
      };
    });
    const orderData: any = {
      products: products,
      totalAmount: data.totalPrice,
      status: "processing",
      paymentStatus: "processing",
      ownerId: user._id,
      transactionId: data.transactionId,
      comment:data.courseLink
    };

    const order = await Order.create(orderData);

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Failed to order. Please try again.",
      });
    }

     sendOrderConfirmationEmail(user.email, {
      orderId: order._id.toString(),
      items: data.items.map((item: any) => ({
        name: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: data.totalPrice,
    });
    
    return NextResponse.json({
      success: true,
      message: "Order is successfully completed",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}
