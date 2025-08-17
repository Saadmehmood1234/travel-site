import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});
console.log(process.env.RAZORPAY_KEY_ID!,process.env.RAZORPAY_KEY_SECRET!)
export async function POST(request: NextRequest, ) {
  try {
    const order = await razorpay.orders.create({
      amount: 100 * 100,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });
    console.log("Orderid",order.id,"Order",order)
    return NextResponse.json({orderid: order.id},{ status: 200 });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    NextResponse
      .json({ success: false, message: "Error creating order" });
  }
}
