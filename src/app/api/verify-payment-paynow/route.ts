import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import Payments from "@/model/Payments";
import dbConnect from "@/lib/dbConnect";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userName,
      userEmail,
      userPhone
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Missing payment details" },
        { status: 400 }
      );
    }
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    const amountInPaise = Number(payment.amount);
    const newPayment = new Payments({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: amountInPaise / 100,
      currency: payment.currency,
      status: 'paid',
      userName: userName,
      userEmail: userEmail,
      userPhone: userPhone
    });

    await newPayment.save();

    return NextResponse.json({ 
      success: true, 
      message: "Payment verified and saved",
      paymentId: newPayment._id 
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { success: false, message: "Error verifying payment" },
      { status: 500 }
    );
  }
}