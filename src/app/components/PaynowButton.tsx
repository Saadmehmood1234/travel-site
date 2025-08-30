"use client";
import { useState } from "react";
import Script from "next/script";
import { FiArrowRight } from "react-icons/fi";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { paymentFormSchema, type PaymentFormData } from "@/lib/validation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentButtonProps {
  onSuccess: () => void;
}

const PaynowButton = ({ onSuccess }: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      amount: "",
    },
  });

  const initiatePayment = async (data: PaymentFormData) => {
    setLoading(true);
    
    try {
      const amountInPaise = Math.round(parseFloat(data.amount) * 100);
      
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: `payment_${Date.now()}`,
          notes: {
            name: data.name,
            email: data.email,
            phone: data.phone,
          },
        }),
      });

      const orderData = await response.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Cloudship Holidays",
        description: "Payment for services",
        order_id: orderData.orderid,
        handler: async function (response: any) {
          const verificationResponse = await fetch("/api/verify-payment-paynow", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...response,
              userName: data.name,
              userEmail: data.email,
              userPhone: data.phone
            }),
          });

          const result = await verificationResponse.json();

          if (result.success) {
            onSuccess();
            setShowModal(false);
            reset();
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    reset();
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      
      <button
        onClick={() => setShowModal(true)}
        className="w-48 bg-gradient-to-r from-primary-600 to-secondary-600 border border-gray-300 hover:bg-gradient-to-r hover:from-primary-800 hover:to-secondary-800 text-white py-3 rounded-lg font-semibold mb-3 flex items-center justify-center"
      >
        Make a Payment <FiArrowRight className="ml-2" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Make a Payment</h3>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(initiatePayment)} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="w-full p-3 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full p-3 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full p-3 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("amount")}
                    className="w-full p-3 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                    placeholder="0.00"
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 bg-gray-300  hover:bg-gray-400 text-gray-800 py-3 rounded-md font-medium"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 w-48 bg-gradient-to-r from-primary-600 to-secondary-600 border border-gray-300 hover:bg-gradient-to-r hover:from-primary-800 hover:to-secondary-800  text-white py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Proceed to Pay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PaynowButton;