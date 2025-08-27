
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createCompleteBooking, confirmBooking } from '@/app/actions/flight.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingData
    } = body;

    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    try {
      const createResult = await createCompleteBooking(bookingData);
      
      if (!createResult.success) {
        throw new Error(createResult.error);
      }

      const confirmResult = await confirmBooking(
        createResult.bookingId,
        razorpay_payment_id
      );

      if (!confirmResult.success) {
        throw new Error(confirmResult.error);
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified and booking confirmed',
        bookingData: confirmResult.booking,
        paymentId: razorpay_payment_id
      });

    } catch (bookingError:any) {
      console.error('Booking storage failed:', bookingError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment verified but booking storage failed',
          details: bookingError.message
        },
        { status: 500 }
      );
    }

  } catch (error:any) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Payment verification failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}