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
import PaymentButton from "./PaymentButton";
import { useRouter } from "next/navigation";
import { getProducts } from "../actions/product.actions";
import { useSession } from "next-auth/react";
import { createOrder } from "@/app/actions/order.actions";
import { parseCurrencyValue } from "@/utils/helpers";
import toast from "react-hot-toast";

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
  price: number;
  originalPrice?: number;
  availableDates?: Date[];
}

export interface BookingData {
  destination: string;
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
  selectedProductId: string;
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
  const [currentStep, setCurrentStep] = useState(1);
  const [trips, setTrips] = useState<TripDetails[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<TripDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    destination: "",
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
    selectedProductId: "",
  });

  const { data: session } = useSession();
  const router = useRouter();
  const [bookingComplete, setBookingComplete] = useState(false);

  const progress = (currentStep / steps.length) * 100;

  useEffect(() => {
    async function fetchAllTrips() {
      try {
        setLoading(true);
        const result = await getProducts();

        if (result.success && result.data) {
          console.log(result.data)
          const transformedData: TripDetails[] = result.data.map((product) => ({
            id: product._id,
            title: product.name,
            subtitle: product.location,
            images: [product.image],
            duration: product.duration,
            difficulty: product.difficulty || "Moderate",
            groupSize: product.groupSize || "12-15",
            rating: product.rating,
            reviews: product.reviews,
            price: product.price,
            originalPrice: product.originalPrice,
            availableDates: product.availableDates
              ? product.availableDates.map((date: any) => new Date(date))
              : undefined,
          }));

          setTrips(transformedData);
        } else {
          setError(result.error || "No products found");
        }
      } catch (err) {
        setError("Failed to load trips");
      } finally {
        setLoading(false);
      }
    }

    fetchAllTrips();
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTripSelection = (tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      setSelectedTrip(trip);
      setBookingData({
        ...bookingData,
        destination: trip.title,
        selectedProductId: trip.id,
      });
    }
  };

  const handlePaymentSuccess = async () => {
  if (!selectedTrip) {
    router.push("/");
    return;
  }

  try {
    const adults = parseInt(bookingData.adults) || 0;
    const children = parseInt(bookingData.children) || 0;
    const quantity = adults + children;
    
    // Calculate total amount based on quantity
    const basePrice = selectedTrip.originalPrice || selectedTrip.price;
    const totalAmount = basePrice * quantity;
    
    console.log("Total amount:", totalAmount, "Quantity:", quantity, "Base price:", basePrice);

    const updatedBookingData: BookingData = {
      ...bookingData,
      userId: session?.user.id || "", // Handle guest users
      trips: JSON.stringify([
        {
          product: selectedTrip.id,
          name: selectedTrip.title,
          location: selectedTrip.subtitle,
          quantity: quantity,
          price: totalAmount, // Use the calculated total amount
          selectedDate: bookingData.checkIn || new Date(),
        },
      ]),
      totalAmount: totalAmount.toString(),
      paymentMethod: "credit-card" as const,
    };

    const result = await createOrder(updatedBookingData);

    if (result.error) {
      console.error("Order creation failed:", result.error);
      toast.error("Order creation failed. Please contact support.");
      return;
    }

    setBookingComplete(true);
    toast.success("Booking confirmed! Check your email for details.");
    
  } catch (error) {
    console.error("Error in payment success handler:", error);
    toast.error("An error occurred. Please contact support.");
  }
};

  const calculateTotal = () => {
    if (!selectedTrip) return 0;
    return selectedTrip.originalPrice || selectedTrip.price;
  };

  const totalAmount = calculateTotal();

  if (loading) {
    return (
      <section id="booking" className="py-20 bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>Loading available trips...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="booking" className="py-20 bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </section>
    );
  }

  if (bookingComplete) {
    return (
      <section id="booking" className="py-20 bg-white mt-12">
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
              <Badge variant="secondary" className="bg-white/20 max-sm:w-32 text-white">
                Step {currentStep} of {steps.length}
              </Badge>
            </div>

            <div className="space-y-2">
              <Progress value={progress} className="h-2 bg-white/20" />
              <div className="flex justify-between">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center space-x-2">
                    <div
                      className={`p-2 max-sm:p-1 rounded-full ${
                        currentStep >= step.id
                          ? "bg-white text-primary-600"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-4 max-sm:h-2 max-sm:w-2 w-4" />
                      ) : (
                        <step.icon className="h-4 w-4 max-sm:h-2 max-sm:w-2" />
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
                  Choose Your Destination
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label htmlFor="destination">Select Destination</Label>
                    <Select
                      value={bookingData.selectedProductId}
                      onValueChange={handleTripSelection}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Choose a destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {trips.map((trip) => (
                          <SelectItem key={trip.id} value={trip.id}>
                            {trip.title} - {trip.subtitle}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTrip && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Selected Trip:</h4>
                      <p className="text-lg">{selectedTrip.title}</p>
                      <p className="text-gray-600">{selectedTrip.subtitle}</p>
                      <p className="text-primary-600 font-bold mt-2">
                        ₹{selectedTrip.price.toLocaleString()}
                        {selectedTrip.originalPrice && (
                          <span className="text-gray-400 line-through ml-2">
                            ₹{selectedTrip.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && selectedTrip && (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  Select Your Dates for {selectedTrip.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Check-in Date</Label>
                    {selectedTrip.availableDates &&
                    selectedTrip.availableDates.length > 0 ? (
                      <Select
                        value={
                          bookingData.checkIn
                            ? bookingData.checkIn.toISOString()
                            : undefined
                        }
                        onValueChange={(value) => {
                          const selectedDate = new Date(value);
                          const durationDays = parseDuration(
                            selectedTrip.duration
                          );
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
                          {selectedTrip.availableDates.map((date, index) => (
                            <SelectItem key={index} value={date.toISOString()}>
                              {format(date, "PPP")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
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
                                const durationDays = parseDuration(
                                  selectedTrip.duration
                                );
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
                  {/* <div>
                    <Label>Check-out Date</Label>
                    <Input
                      value={
                        bookingData.checkOut
                          ? format(bookingData.checkOut, "PPP")
                          : "Will be calculated based on trip duration"
                      }
                      className="h-12"
                      readOnly
                    />
                  </div> */}
                </div>

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
                      required
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
                      required
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
                      required
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
                      required
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
                <div>
                  <Label htmlFor="specialRequests">
                    Special Requests (Optional)
                  </Label>
                  <Input
                    id="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        specialRequests: e.target.value,
                      })
                    }
                    placeholder="Any special requirements or preferences"
                    className="h-12"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6  bg-transparent"
              >
                <ArrowLeft className="mr-2 h-4 w-4 " />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && !bookingData.selectedProductId) ||
                    (currentStep === 2 &&
                      (!bookingData.checkIn || !bookingData.checkOut))
                  }
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 px-6"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <div className="w-40">
                  {selectedTrip && (
                    <PaymentButton
                      amount={selectedTrip?.price}
                      onSuccess={handlePaymentSuccess}
                      bookingData={bookingData}
                    />
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
