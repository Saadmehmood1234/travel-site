"use client";
import { useState } from 'react';
import Script from 'next/script';
import { FiArrowRight } from 'react-icons/fi';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentButtonProps {
  amount: string | undefined;
  onSuccess: () => void;
  bookingData: any;
}

const PaymentButton = ({ amount, onSuccess, bookingData }: PaymentButtonProps) => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/create-order', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount: amount && parseInt(amount) * 100,
          currency: "INR",
          receipt: `booking_${Date.now()}`,
          notes: {
            bookingData: JSON.stringify(bookingData)
          }
        }),
      });
      
      const data = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'Travel Company',
        description: 'Trip Booking Payment',
        order_id: data.orderid,
        handler: async function(response: any) {
          const verificationResponse = await fetch('/api/verify-payment', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(response),
          });
          
          if (verificationResponse.ok) {
            onSuccess();
          } else {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: `${bookingData.firstName} ${bookingData.lastName}`,
          email: bookingData.email,
          contact: bookingData.phone
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
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
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mb-3 flex items-center justify-center disabled:opacity-50"
      >
        {loading ? 'Processing...' : `Pay ₹${amount?.toLocaleString()}`} <FiArrowRight className="ml-2" />
      </button>
    </>
  );
};

export default PaymentButton;