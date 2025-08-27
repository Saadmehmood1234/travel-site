import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Clock, MapPin, Calendar, User, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { getAirlineName, getCityName } from "@/lib/Destinations";

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

interface FlightDetailModalProps {
  flight: Flight;
  onClose: () => void;
  onBook: (flight: Flight) => void;
  passengers: number;
}

const convertToINR = (amount: number, currency: string): number => {
  if (currency === "INR") return amount;
  const conversionRates: Record<string, number> = {
    "EUR": 90.5,
    "USD": 83.2, 
    "GBP": 105.3, 
  };
  
  return amount * (conversionRates[currency] || 1);
};

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function FlightDetailModal({ flight, onClose, onBook, passengers }: FlightDetailModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const platformFee = 199;
  const priceInINR = convertToINR(flight.price, flight.currency);
  const totalPrice = priceInINR * passengers + platformFee;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleBook = () => {
    onBook(flight);
    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-xl transform transition-transform ${isClosing ? 'scale-95' : 'scale-100'}`}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Flight Details</h2>
                <p className="text-gray-600">
                  {flight.departure.city} ({flight.departure.airport}) to {flight.arrival.city} ({flight.arrival.airport})
                </p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <div className="text-2xl font-bold text-primary-600">
                  ₹{Math.round(totalPrice).toLocaleString('en-IN')}
                </div>
                <p className="text-sm text-gray-500">Total for {passengers} {passengers === 1 ? 'person' : 'people'}</p>
              </div>
            </div>

            {/* Flight Summary */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <Plane className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{getAirlineName(flight.airline)}</h3>
                    <p className="text-sm text-gray-600">{flight.flightNumber}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  {flight.duration}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div>
                  <div className="text-lg font-bold">{flight.departure.time}</div>
                  <div className="text-sm">{flight.departure.city} ({flight.departure.airport})</div>
                  <div className="text-xs text-gray-500">{formatDateTime(flight.departure.datetime)}</div>
                </div>
                
                <ArrowRight className="h-5 w-5 text-gray-400 mx-2" />
                
                <div className="text-right">
                  <div className="text-lg font-bold">{flight.arrival.time}</div>
                  <div className="text-sm">{flight.arrival.city} ({flight.arrival.airport})</div>
                  <div className="text-xs text-gray-500">{formatDateTime(flight.arrival.datetime)}</div>
                </div>
              </div>
            </div>

            {/* Flight Segments */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Flight Itinerary</h3>
              <div className="space-y-4">
                {flight.segments.map((segment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <Plane className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{getAirlineName(segment.airline)}</h4>
                          <p className="text-sm text-gray-600">{segment.flightNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {segment.duration}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{segment.departure.time}</div>
                        <div className="text-sm">{getCityName(segment.departure.airport)} ({segment.departure.airport})</div>
                        {segment.departure.terminal && (
                          <div className="text-xs text-gray-500">Terminal {segment.departure.terminal}</div>
                        )}
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-gray-400 mx-2" />
                      
                      <div className="text-right">
                        <div className="font-medium">{segment.arrival.time}</div>
                        <div className="text-sm">{getCityName(segment.arrival.airport)} ({segment.arrival.airport})</div>
                        {segment.arrival.terminal && (
                          <div className="text-xs text-gray-500">Terminal {segment.arrival.terminal}</div>
                        )}
                      </div>
                    </div>
                    
                    {index < flight.segments.length - 1 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                        <div className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Layover: {formatDuration(calculateLayover(flight.segments[index].arrival.datetime, flight.segments[index + 1].departure.datetime))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-3">Price Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Base Fare ({passengers} {passengers === 1 ? 'person' : 'people'})</span>
                  <span>₹{Math.round(priceInINR * passengers).toLocaleString('en-IN')}</span>
                </div>
                {flight.currency !== "INR" && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Original price ({flight.currency})</span>
                    <span>{flight.currency} {(flight.price * passengers).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span>₹{platformFee}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>₹{Math.round(totalPrice).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Passenger Information
                </h4>
                <p className="text-sm">{passengers} {passengers === 1 ? 'Adult' : 'Adults'}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Flight Details
                </h4>
                <p className="text-sm">{flight.stops} {flight.stops === 1 ? 'Stop' : 'Stops'}</p>
                <p className="text-sm">{flight.seatsAvailable} {flight.seatsAvailable === 1 ? 'Seat' : 'Seats'} Available</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1"
              >
                Back to Results
              </Button>
              {/* <Button
                onClick={handleBook}
                className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
              >
                Book Now
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to calculate layover time
function calculateLayover(arrivalDateTime: string, departureDateTime: string): number {
  const arrival = new Date(arrivalDateTime).getTime();
  const departure = new Date(departureDateTime).getTime();
  return Math.floor((departure - arrival) / (1000 * 60));
}