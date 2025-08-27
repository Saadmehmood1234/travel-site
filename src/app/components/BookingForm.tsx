"use client";
import {  getAirlineName } from "@/lib/Destinations";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Plane, UserPlus, Mail, Phone, IndianRupee } from "lucide-react";

interface Passenger {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
}

interface BookingFormProps {
  flight: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceedToPayment: (
    passengers: Passenger[],
    totalAmount: number,
    customerInfo: any
  ) => void;
}

export default function BookingForm({
  flight,
  open,
  onOpenChange,
  onProceedToPayment,
}: BookingFormProps) {
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
    },
  ]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [conversionRate, setConversionRate] = useState(90); 
  const platformFee = 199;

  const flightPriceInINR = flight ? flight.price * conversionRate : 0;
  const totalAmount = flightPriceInINR * passengers.length + platformFee;

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        setConversionRate(90);
      } catch (error) {
        setConversionRate(90);
      }
    };

    fetchConversionRate();
  }, []);

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      {
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
      },
    ]);
  };

  const updatePassenger = (
    index: number,
    field: keyof Passenger,
    value: string
  ) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const isFormValid =
    passengers.every((p) => p.firstName && p.lastName && p.age && p.gender) &&
    email &&
    phone;

  if (!isFormValid) {
    alert("Please fill all required fields");
    return;
  }

  const customerInfo = {
    email,
    phone,
    firstName: passengers[0]?.firstName,
    lastName: passengers[0]?.lastName,
    primaryPassenger: passengers[0],
  };

  onProceedToPayment(passengers, totalAmount, customerInfo);
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-r from-primary-600/20 to-secondary-600/20 backdrop-blur-sm border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-100 text-center">
            Book Your Flight
          </DialogTitle>
        </DialogHeader>

        {flight && (
          <div className="mb-6 p-4 bg-white/80 border border-gray-300 rounded-lg">
            <h3 className="font-semibold mb-2 text-primary-600">
              Flight Details
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Plane className="h-5 w-5 text-primary-600" />
              <p className="font-medium text-gray-800">
                {getAirlineName(flight.airline)} - {flight.flightNumber}
              </p>
            </div>
            <p className="text-gray-700">
              {flight.departure.city} to {flight.arrival.city}
            </p>
            <p className="text-gray-700">
              Departure: {flight.departure.time},{" "}
              {new Date(flight.departure.date).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              Duration: {flight.duration} ({flight.stops} stop
              {flight.stops !== 1 ? "s" : ""})
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-gray-100">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-100">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-primary-600" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500 h-12"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-100">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-secondary-600" />
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-12 bg-white/80 border-gray-300 text-gray-800 placeholder:text-gray-500 h-12"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-100">
                  Passenger Details
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPassenger}
                  className="bg-white/80 border-gray-300 text-gray-800 hover:bg-white"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Passenger
                </Button>
              </div>
              <div className="space-y-4">
                {passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/80 border border-gray-300 rounded-lg"
                  >
                    <h4 className="font-medium mb-3 text-primary-600">
                      Passenger {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`firstName-${index}`}
                          className="text-gray-800"
                        >
                          First Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`firstName-${index}`}
                          value={passenger.firstName}
                          onChange={(e) =>
                            updatePassenger(index, "firstName", e.target.value)
                          }
                          className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor={`lastName-${index}`}
                          className="text-gray-800"
                        >
                          Last Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`lastName-${index}`}
                          value={passenger.lastName}
                          onChange={(e) =>
                            updatePassenger(index, "lastName", e.target.value)
                          }
                          className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 h-12"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`age-${index}`}
                          className="text-gray-800"
                        >
                          Age <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`age-${index}`}
                          type="number"
                          min="0"
                          max="120"
                          value={passenger.age}
                          onChange={(e) =>
                            updatePassenger(index, "age", e.target.value)
                          }
                          className="bg-white border-gray-300 text-gray-800 placeholder:text-gray-500 h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor={`gender-${index}`}
                          className="text-gray-800"
                        >
                          Gender <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={passenger.gender}
                          onValueChange={(value) =>
                            updatePassenger(index, "gender", value)
                          }
                          required
                        >
                          <SelectTrigger className="bg-white border-gray-300 text-gray-800 h-12">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-300 text-gray-800">
                            <SelectItem
                              value="male"
                              className="hover:bg-gray-100"
                            >
                              Male
                            </SelectItem>
                            <SelectItem
                              value="female"
                              className="hover:bg-gray-100"
                            >
                              Female
                            </SelectItem>
                            <SelectItem
                              value="other"
                              className="hover:bg-gray-100"
                            >
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white/80 border border-gray-300 rounded-lg">
              <h3 className="font-semibold mb-3 text-primary-600">
                Price Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Original Price (EUR)</span>
                  <span>€{flight?.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 text-sm">
                  <span>Conversion Rate (1 EUR = INR)</span>
                  <span>{conversionRate}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Flight Price x {passengers.length}</span>
                  <span className="flex items-center">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {(flightPriceInINR * passengers.length).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Platform Fee</span>
                  <span className="flex items-center">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    {platformFee.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-3 border-t border-gray-300">
                  <span className="text-gray-800">Total Amount</span>
                  <span className="text-primary-600 flex items-center">
                    <IndianRupee className="h-5 w-5 mr-1" />
                    {totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white py-3 text-lg h-14 rounded-lg"
            >
              Proceed to Payment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}