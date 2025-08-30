"use client";
import { useState, useEffect } from "react";
import Script from "next/script";
import { FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentButtonProps {
  amount: number | undefined;
  onSuccess: () => void;
  bookingData: any;
}

const PaymentButton = ({
  amount,
  onSuccess,
  bookingData,
}: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Calculate total amount when component mounts or bookingData changes
  useEffect(() => {
    if (amount && bookingData) {
      const adults = Number(bookingData?.adults) || 0;
      const children = Number(bookingData?.children) || 0;
      const quantity = adults + children;
      setTotalAmount(amount * quantity);
    }
  }, [amount, bookingData]);

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const adults = Number(bookingData?.adults) || 0;
      const children = Number(bookingData?.children) || 0;
      const quantity = adults + children;
      
      if (!amount) {
        toast.error("Invalid amount");
        return;
      }

      const amountInPaise = Math.round(amount * 100);
      const totalAmountInPaise = amountInPaise * quantity;

      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmountInPaise,
          currency: "INR",
          receipt: `booking_${Date.now()}`,
          notes: {
            bookingData: JSON.stringify(bookingData),
          },
        }),
      });

      const data = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Travel Company",
        description: "Trip Booking Payment",
        order_id: data.orderid,
        handler: async function (response: any) {
          const verificationResponse = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(response),
          });
         console.log("Payment Verified",verificationResponse)
          const result = await verificationResponse.json();

          if (result.success) {
            onSuccess();
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: `${bookingData.firstName} ${bookingData.lastName}`,
          email: bookingData.email,
          contact: bookingData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <button
        onClick={initiatePayment}
        disabled={loading || !amount || totalAmount === 0}
        className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white py-3 rounded-lg font-semibold mb-3 flex items-center justify-center disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : `Pay ₹${totalAmount?.toLocaleString('en-IN')}`}{" "}
        <FiArrowRight className="ml-2" />
      </button>
    </>
  );
};

export default PaymentButton;