"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CalendarIcon,
  Users,
  CreditCard,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import PaymentButton from "../../components/PaymentButton";
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "../../actions/product.actions";
import { useSession } from "next-auth/react";
import { createOrder } from "@/app/actions/order.actions";
import { parseCurrencyValue } from "@/utils/helpers";

interface TripDetails {
  id: string;
  title: string;
  subtitle: string;
  images: string[];
  duration: string;
  difficulty: string;
  groupSize: string;
  rating: number;
  reviews: number;
  price: string;
  discountPrice?: string;
  availableDates?: Date[]; // Add available dates to trip details
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
  userId: string;
  trips: string;
  totalAmount: string;
  paymentMethod: "credit-card" | "upi" | "paypal" | "cash";
}

const steps = [
  { id: 1, name: "Destination", icon: MapPin },
  { id: 2, name: "Dates", icon: CalendarIcon },
  { id: 3, name: "Travelers", icon: Users },
  { id: 4, name: "Payment", icon: CreditCard },
];
const parseDuration = (duration: string): number => {
  const match = duration.match(/(\d+)\s*day/i);
  return match ? parseInt(match[1]) : 1;
};
export default function BookingWidget() {
  const params = useParams();
  const id = params.id as string;
  const [currentStep, setCurrentStep] = useState(1);
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    destination: tripDetails?.title,
    checkIn: undefined,
    checkOut: undefined,
    adults: "2",
    children: "0",
    rooms: "1",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    specialRequests: "",
    userId: "",
    trips: "[]",
    totalAmount: "0",
    paymentMethod: "credit-card",
  });

  const { data: session } = useSession();
  const router = useRouter();
  const [bookingComplete, setBookingComplete] = useState(false);

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === 1) {
      if (!session) {
        router.push("/auth/signin");
        return;
      }
      setBookingData({
        ...bookingData,
        destination: tripDetails?.title,
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    async function fetchTripDetails() {
      try {
        setLoading(true);
        const result = await getProductById(id);

        if (result.success && result.data) {
          const product = result.data;

          // Transform available dates if they exist
          // Transform available dates if they exist
          const availableDates =
            product.availableDates && Array.isArray(product.availableDates)
              ? product.availableDates.map(
                  (dateString: any) => new Date(dateString)
                )
              : undefined;
          const transformedData: TripDetails = {
            id: product._id,
            title: product.name,
            subtitle: product.location,
            images: [product.image],
            duration: product.duration,
            difficulty: product.difficulty || "Moderate",
            groupSize: product.groupSize || "12-15",
            rating: product.rating,
            reviews: product.reviews,
            price: `₹${
              product.originalPrice?.toLocaleString() ||
              product.price.toLocaleString()
            }`,
            discountPrice: product.originalPrice
              ? `₹${product.price.toLocaleString()}`
              : undefined,
            availableDates: availableDates, // Add available dates
          };

          setTripDetails(transformedData);
        } else {
          setError(result.error || "Product not found");
        }
      } catch (err) {
        console.error("Error fetching trip details:", err);
        setError("Failed to load trip details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTripDetails();
    }
  }, [id]);

  const handlePaymentSuccess = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    try {
      const quantity =
        parseInt(bookingData.adults) + parseInt(bookingData.children);
      const rawPrice = tripDetails?.price || "0";
      const numericPrice = parseCurrencyValue(rawPrice.slice(1));
      const totalAmount = numericPrice * quantity;

      const updatedBookingData: BookingData = {
        ...bookingData,
        userId: session.user.id,
        trips: JSON.stringify([
          {
            product: tripDetails?.id,
            name: tripDetails?.title,
            location: tripDetails?.subtitle,
            quantity: quantity,
            price: numericPrice,
            selectedDate: bookingData.checkIn || new Date(),
          },
        ]),
        totalAmount: totalAmount.toString(),
        paymentMethod: "credit-card" as const,
      };

      setBookingData(updatedBookingData);

      const result = await createOrder(updatedBookingData);

      if (result.error) {
        console.error("Order creation failed:", result.error);
        return;
      }

      setBookingComplete(true);
      console.log("Booking completed:", updatedBookingData);
      console.log("Order created with ID:", result.orderId);
    } catch (error) {
      console.error("Error in payment success handler:", error);
    }
  };

  const calculateTotal = () => {
    return tripDetails?.discountPrice;
  };

  const totalAmount = calculateTotal();

  if (bookingComplete) {
    return (
      <section id="booking" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-700">
              Booking Complete
            </Badge>
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Thank You for Your Booking!
            </h2>
            <p className="text-xl text-gray-600">
              Your trip has been confirmed. We've sent the details to your
              email.
            </p>
          </div>

          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-heading text-center">
                Booking Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Your adventure awaits!
              </h3>
              <p className="text-gray-600 mb-6">
                We've sent a confirmation email to{" "}
                <strong>{bookingData.email}</strong> with all the details of
                your trip.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-primary-500 to-secondary-500"
              >
                Book Another Trip
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 bg-white mt-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-secondary-100 text-secondary-700 hover:bg-secondary-200">
            Easy Booking
          </Badge>
          <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Book Your Perfect Trip
          </h2>
          <p className="text-xl text-gray-600">
            Complete your booking in just a few simple steps
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-t-lg">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl font-heading">
                Complete Your Booking
              </CardTitle>
              <Badge variant="secondary" className="bg-white/20 text-white">
                Step {currentStep} of {steps.length}
              </Badge>
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-2 bg-white/20" />
              <div className="flex justify-between">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center space-x-2">
                    <div
                      className={`p-2 rounded-full ${
                        currentStep >= step.id
                          ? "bg-white text-primary-600"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        currentStep >= step.id ? "text-white" : "text-white/70"
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Your Destination
                </h3>
                <div>
                  <p>{tripDetails?.title}</p>
                </div>

                {bookingData.destination && (
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold mb-2">
                      {bookingData.destination}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {tripDetails?.subtitle}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Dates */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Select Your Dates
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Check-in Date */}
                  <div>
                    <Label>Check-in Date</Label>

                    {/* If product has available dates, show a dropdown */}
                    {tripDetails?.availableDates &&
                    tripDetails.availableDates.length > 0 ? (
                      <Select
                        value={
                          bookingData.checkIn
                            ? bookingData.checkIn.toISOString()
                            : undefined
                        }
                        // Replace the onValueChange handler in the check-in date Select component
                        onValueChange={(value) => {
                          const selectedDate = new Date(value);
                          const durationDays = tripDetails?.duration
                            ? parseDuration(tripDetails.duration)
                            : 1;
                          const checkoutDate = new Date(selectedDate);
                          checkoutDate.setDate(
                            checkoutDate.getDate() + durationDays
                          );

                          setBookingData({
                            ...bookingData,
                            checkIn: selectedDate,
                            checkOut: checkoutDate,
                          });
                        }}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select available date" />
                        </SelectTrigger>
                        <SelectContent>
                          {tripDetails.availableDates.map((date, index) => (
                            <SelectItem key={index} value={date.toISOString()}>
                              {format(date, "PPP")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      // If no available dates, show calendar as before
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-12 justify-start text-left font-normal text-gray-900 border-gray-200 bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {bookingData.checkIn
                              ? format(bookingData.checkIn, "PPP")
                              : "Select check-in date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto min-w-[300px] p-4 bg-white rounded-xl shadow-xl">
                          <Calendar
                            className="w-full"
                            mode="single"
                            selected={bookingData.checkIn}
                            onSelect={(date) => {
                              if (date) {
                                const durationDays = tripDetails?.duration
                                  ? parseDuration(tripDetails.duration)
                                  : 1;
                                const checkoutDate = new Date(date);
                                checkoutDate.setDate(
                                  checkoutDate.getDate() + durationDays
                                );

                                setBookingData({
                                  ...bookingData,
                                  checkIn: date,
                                  checkOut: checkoutDate,
                                });
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>

                  {/* Check-out Date */}
                  <div>
                    <Label>Check-out Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left font-normal text-gray-900 border-gray-200 bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingData.checkOut
                            ? format(bookingData.checkOut, "PPP")
                            : "Select check-out date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto min-w-[300px] p-4 bg-white rounded-xl shadow-xl">
                        <Calendar
                          className="w-full"
                          mode="single"
                          selected={bookingData.checkOut}
                          onSelect={(date) =>
                            setBookingData({ ...bookingData, checkOut: date })
                          }
                          disabled={(date) => {
                            if (date < new Date()) return true;
                            if (bookingData.checkIn)
                              return date <= bookingData.checkIn;
                            return false;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Duration Info */}
                {bookingData.checkIn && bookingData.checkOut && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Trip duration:{" "}
                      {Math.ceil(
                        (bookingData.checkOut.getTime() -
                          bookingData.checkIn.getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Travelers */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Traveler Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <Label>Adults</Label>
                    <Select
                      value={bookingData.adults}
                      onValueChange={(value) =>
                        setBookingData({ ...bookingData, adults: value })
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} Adult{num > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Children</Label>
                    <Select
                      value={bookingData.children}
                      onValueChange={(value) =>
                        setBookingData({ ...bookingData, children: value })
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Child" : "Children"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Rooms</Label>
                    <Select
                      value={bookingData.rooms}
                      onValueChange={(value) =>
                        setBookingData({ ...bookingData, rooms: value })
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} Room{num > 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={bookingData.firstName}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          firstName: e.target.value,
                        })
                      }
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={bookingData.lastName}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          lastName: e.target.value,
                        })
                      }
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={bookingData.email}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          email: e.target.value,
                        })
                      }
                      className="h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={bookingData.phone}
                      onChange={(e) =>
                        setBookingData({
                          ...bookingData,
                          phone: e.target.value,
                        })
                      }
                      className="h-12"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Payment */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Complete Your Payment
                </h3>

                {/* Booking Summary */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4">
                    Booking Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Destination:</span>
                      <span className="font-medium">{tripDetails?.title}</span>
                    </div>
                    {bookingData.checkIn && bookingData.checkOut && (
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium">
                          {Math.ceil(
                            (bookingData.checkOut.getTime() -
                              bookingData.checkIn.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Travelers:</span>
                      <span className="font-medium">
                        {bookingData.adults} Adults, {bookingData.children}{" "}
                        Children
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rooms:</span>
                      <span className="font-medium">{bookingData.rooms}</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className="text-primary-600">
                          {totalAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Secure payment processed by Razorpay
                  </p>
                  {tripDetails?.price && (
                    <PaymentButton
                      amount={tripDetails?.discountPrice}
                      onSuccess={handlePaymentSuccess}
                      bookingData={bookingData}
                    />
                  )}
                  <p className="text-sm text-gray-500 mt-4">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    currentStep === 2 &&
                    (!bookingData.checkIn || !bookingData.checkOut)
                  }
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 px-6"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <div className="w-40">
                  {/* Payment button is already displayed in step 4 content */}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
