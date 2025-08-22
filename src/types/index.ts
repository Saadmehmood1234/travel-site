import { Types } from 'mongoose';

export interface OrderCreateInput {
  userId: Types.ObjectId;
  trips: {
    product: Types.ObjectId;
    name: string;
    location: string;
    quantity: number;
    price: number;
    selectedDate: Date;
  }[];
  totalAmount: number;
  paymentMethod: "credit-card" | "upi" | "paypal" | "cash";
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
}

export interface BookingData {
  destination: string | undefined;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  adults: string;
  children: string;
  rooms: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  specialRequests: string;
  // Add these fields
  userId: string;
  trips: string; // This will be stringified JSON
  totalAmount: string;
  paymentMethod: "credit-card" | "upi" | "paypal" | "cash";
}