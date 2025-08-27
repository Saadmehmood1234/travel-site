import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, receipt, notes } = body;
    if (!amount || !currency) {
      return NextResponse.json(
        { success: false, message: "Amount and currency are required" },
        { status: 400 }
      );
    }
 
    const order = await razorpay.orders.create({
      amount: amount, 
      currency: currency || "INR", 
      receipt: receipt || "receipt_" + Math.random().toString(36).substring(7),
      notes: notes || {},
    });

    return NextResponse.json({
      success: true,
      orderid: order.id,
      amount: order.amount,
      currency: order.currency
    }, { status: 200 });

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { success: false, message: "Error creating order" },
      { status: 500 }
    );
  }
}