import { Types } from "mongoose";

export interface OrderTrip {
  product: Types.ObjectId | { _id: string; name: string; images: string[] };
  name: string;
  location: string;
  quantity: number;
  price: number;
  selectedDate: Date;
}
export interface Trip {
  product: Types.ObjectId | { _id: string; name: string; images?: string[] };
  name: string;
  location: string;
  quantity: number;
  price: number;
  selectedDate: Date;
}
export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}

export interface IOrder {
  _id: string;
  userId: string;
  trips: OrderTrip[];
  totalAmount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  bookingDate: Date;
  paymentMethod: "credit-card" | "upi" | "paypal" | "cash";
  paymentStatus: "unpaid" | "paid" | "refunded";
  contactInfo: ContactInfo;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrdersResponse {
  orders: IOrder[];
  totalPages: number;
  currentPage: number;
  error?: string;
  success?: boolean;
  message?: string;
}
