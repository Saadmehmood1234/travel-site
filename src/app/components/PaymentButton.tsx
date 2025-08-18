"use client"
import { useState } from 'react';
import Script from 'next/script';
import axios from 'axios';
import { FiArrowRight } from 'react-icons/fi';
declare global{
    interface Window{
        Razorpay:any
    }
}
const PaymentButton = () => {
  const [loading, setLoading] = useState(false);
  const AMOUNT=100
  const initiatePayment = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/create-order', {
       method:"POST"
      });
    const data=await response.json()
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: AMOUNT*100,
        currency: "INR",
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: data.orderid,
        handler: async function(response: any) {
          console.log("Payment Successful",response)
          alert('Payment Successful!');
        },
        prefill: {
          name: 'Saad Don',
          email: 'customer@example.com',
          contact: '9773834796'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp1 = new (window as any).Razorpay(options);
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
      />
      <button
        onClick={initiatePayment}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mb-3 flex items-center justify-center"
      >
        {loading ? 'Processing...' : 'Pay Now'} <FiArrowRight className="ml-2" />
      </button>
    </>
  );
};

export default PaymentButton;