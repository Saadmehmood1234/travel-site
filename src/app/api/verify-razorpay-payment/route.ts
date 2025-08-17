import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { orderId, paymentId, signature } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature === signature) {
      // ✅ Signature is valid
      // 👉 Save payment details to DB, update order status, send confirmation, etc.

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid signature" }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error verifying payment" }),
      { status: 500 }
    );
  }
}

// (Optional) Handle wrong HTTP methods gracefully
export async function GET() {
  return new Response(
    JSON.stringify({ success: false, message: "Method not allowed" }),
    { status: 405, headers: { Allow: "POST" } }
  );
}
