'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import Flight from '@/model/Flight';
import dbConnect from '@/lib/dbConnect';

export async function createCompleteBooking(bookingData: any) {
  await dbConnect();
  
  try {
    const booking = new Flight({
      flightId: bookingData.flight.id,
      airline: bookingData.flight.airline,
      flightNumber: bookingData.flight.flightNumber,
      departure: {
        airport: bookingData.flight.departure.airport,
        city: bookingData.flight.departure.city,
        date: new Date(bookingData.flight.departure.date),
        time: bookingData.flight.departure.time
      },
      arrival: {
        airport: bookingData.flight.arrival.airport,
        city: bookingData.flight.arrival.city,
        date: new Date(bookingData.flight.arrival.date),
        time: bookingData.flight.arrival.time
      },
      passengers: bookingData.passengers.map((p: any) => ({
        firstName: p.firstName,
        lastName: p.lastName,
        age: parseInt(p.age),
        gender: p.gender
      })),
      totalAmount: bookingData.totalAmount,
      status: 'pending',
      customerEmail: bookingData.customerInfo.email,
      customerPhone: bookingData.customerInfo.phone
    });

    await booking.save();
    return { success: true, bookingId: booking._id.toString() };
  } catch (error) {
    console.error('Complete booking creation failed:', error);
    return { success: false, error: 'Booking creation failed' };
  }
}

export async function confirmBooking(bookingId: string, paymentId: string) {
  await dbConnect();
  
  try {
    const booking = await Flight.findByIdAndUpdate(
      bookingId,
      { status: 'confirmed', paymentId },
      { new: true }
    );

    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    revalidatePath('/bookings');
    return { success: true, booking };
  } catch (error) {
    console.error('Booking confirmation failed:', error);
    return { success: false, error: 'Booking confirmation failed' };
  }
}