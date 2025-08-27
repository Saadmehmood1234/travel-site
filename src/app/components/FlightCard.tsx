import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Clock, Info, MapPin } from "lucide-react";
import { useState } from "react";
import { getAirlineName } from "@/lib/Destinations";
import FlightDetailModal from "./FlightDetailModal";

// Update the Flight interface to match what FlightDetailModal expects
interface FlightSegment {
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    terminal?: string;
    datetime: string;
  };
  arrival: {
    airport: string;
    time: string;
    terminal?: string;
    datetime: string;
  };
  duration: string;
}

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    city: string;
    date: string;
    datetime: string;
  };
  arrival: {
    airport: string;
    time: string;
    city: string;
    date: string;
    datetime: string;
  };
  duration: string;
  durationMinutes: number;
  price: number;
  currency: string;
  seatsAvailable: number;
  stops: number;
  segments: FlightSegment[];
}

interface FlightCardProps {
  flight: Flight;
  onBook: (flight: Flight) => void;
  passengers: number;
}

const convertToINR = (amount: number, currency: string): number => {
  if (currency === "INR") return amount;
  const conversionRates: Record<string, number> = {
    EUR: 90.5,
    USD: 83.2,
    GBP: 105.3,
  };

  return amount * (conversionRates[currency] || 1);
};

export default function FlightCard({
  flight,
  onBook,
  passengers,
}: FlightCardProps) {
  const [showFeeBreakdown, setShowFeeBreakdown] = useState(false);
  const platformFee = 199;
  const priceInINR = convertToINR(flight.price, flight.currency);
  const totalPrice = priceInINR * passengers + platformFee;
  const [showDetail, setShowDetail] = useState(false);

  return (
    <Card className="mb-6 rounded-xl shadow-md border border-gray-100 bg-white">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {getAirlineName(flight.airline)}
            </h3>
            <p className="text-xs text-gray-500">{flight.flightNumber}</p>
            {flight.stops > 0 && (
              <div className="flex items-center mt-1 text-xs text-amber-600">
                <MapPin className="h-3 w-3 mr-1" />
                {flight.stops} stop{flight.stops > 1 ? "s" : ""}
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-lg sm:text-xl font-bold text-primary-600">
              ₹{Math.round(totalPrice).toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {flight.currency !== "INR" && (
                <span className="mr-2">
                  {flight.currency} {flight.price.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={() => setShowFeeBreakdown(!showFeeBreakdown)}
              className="text-xs text-gray-500 flex items-center mt-1"
            >
              <Info className="h-3 w-3 mr-1" />
              Price details
            </button>
          </div>
        </div>

        {showFeeBreakdown && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
            <div className="flex justify-between mb-1">
              <span>Flight Fare (x{passengers})</span>
              <span>
                ₹{Math.round(priceInINR * passengers).toLocaleString("en-IN")}
              </span>
            </div>
            {flight.currency !== "INR" && (
              <div className="flex justify-between mb-1 text-xs text-gray-500">
                <span>Original price ({flight.currency})</span>
                <span>
                  {flight.currency} {(flight.price * passengers).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>₹{platformFee}</span>
            </div>
            <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-medium">
              <span>Total (INR)</span>
              <span>₹{Math.round(totalPrice).toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <p className="text-lg font-bold text-gray-900">
              {flight.departure.time}
            </p>
            <p className="text-sm text-gray-700">{flight.departure.city}</p>
            <p className="text-xs text-gray-500">{flight.departure.airport}</p>
          </div>
          <div className="flex flex-col items-center mx-3 w-20">
            <div className="flex items-center text-gray-600 text-xs">
              <Clock className="h-3 w-3 mr-1 text-primary-500" />
              {flight.duration}
            </div>
            <div className="relative w-full h-px bg-gray-300 my-2">
              <Plane className="h-4 w-4 absolute -top-2 left-1/2 -translate-x-1/2 text-primary-600" />
            </div>
            <span className="text-[10px] text-gray-500">
              {flight.stops === 0
                ? "Non-stop"
                : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </span>
          </div>
          <div className="text-center flex-1">
            <p className="text-lg font-bold text-gray-900">
              {flight.arrival.time}
            </p>
            <p className="text-sm text-gray-700">{flight.arrival.city}</p>
            <p className="text-xs text-gray-500">{flight.arrival.airport}</p>
          </div>
        </div>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Flight fare per person</span>
            <div className="text-right">
              <span className="font-medium text-primary-600">
                ₹{Math.round(priceInINR).toLocaleString("en-IN")}
              </span>
              {flight.currency !== "INR" && (
                <div className="text-xs text-gray-500">
                  {flight.currency} {flight.price.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            {flight.seatsAvailable}{" "}
            {flight.seatsAvailable === 1 ? "seat" : "seats"} left
          </p>
          <Button
            onClick={() => setShowDetail(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white rounded-lg text-sm py-2"
          >
            View Detail
          </Button>
        </div>
      </CardContent>
      {showDetail && (
        <FlightDetailModal
          flight={flight}
          onClose={() => setShowDetail(false)}
          onBook={onBook}
          passengers={passengers}
        />
      )}
    </Card>
  );
}