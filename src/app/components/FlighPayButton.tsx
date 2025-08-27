"use client";
import { useState } from "react";
import Script from "next/script";
import { FiArrowRight } from "react-icons/fi";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FlightPayProps {
  amount: number;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
  bookingData: any;
}

const FlightPayButton = ({
  amount,
  onSuccess,
  onError,
  bookingData,
}: FlightPayProps) => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);

    try {
      const amountInPaise = Math.round(amount * 100);
      const completeBookingData = {
        ...bookingData,
        flight: bookingData.flight, 
        passengers: bookingData.passengers,
        customerInfo: bookingData.customerInfo,
        totalAmount: amount,
      };

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `booking_${Date.now()}`,
          notes: {
            bookingData: JSON.stringify(completeBookingData),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Cloudship Holidays",
        description: "Flight Booking Payment",
        order_id: data.orderid,
        handler: async function (response: any) {
          const verificationResponse = await fetch("/api/flights/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: bookingData,
            }),
          });

          const result = await verificationResponse.json();

          if (result.success) {
            onSuccess({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: result.bookingData,
            });
          } else {
            onError("Payment verification failed");
          }
        },
        prefill: {
          name: `${bookingData.firstName || ""} ${
            bookingData.lastName || ""
          }`.trim(),
          email: bookingData.email || "",
          contact: bookingData.phone || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      onError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onError={() => console.error("Failed to load Razorpay script")}
      />
      <button
        onClick={initiatePayment}
        disabled={loading}
        className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-3 px-6 rounded-lg font-semibold mb-3 flex items-center justify-center disabled:opacity-50 transition-colors"
      >
        {loading ? "Processing..." : `Pay ₹${amount?.toLocaleString()}`}
        {!loading && <FiArrowRight className="ml-2" />}
      </button>
    </>
  );
};

export default FlightPayButton;
