'use client';

import { useState } from 'react';
import FlightSearch from '../components/FlightSearch';
import FlightCard from '../components/FlightCard';
import BookingForm from '../components/BookingForm';
import FlightPayButton from '../components/FlighPayButton';
import toast from 'react-hot-toast';

export default function FlightBooking() {
  const [flights, setFlights] = useState<any[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [passengers, setPassengers] = useState(1);

  const handleFlightsFound = (foundFlights: any[]) => {
    setFlights(foundFlights);
    setIsSearching(false);
  };

  const handleBookFlight = (flight: any) => {
    setSelectedFlight(flight);
    setShowBookingForm(true);
  };

  const handleProceedToPayment = (passengers: any[], totalAmount: number, customerInfo: any) => {
    setBookingData({
      flight: selectedFlight,
      passengers,
      customerInfo,
      totalAmount
    });
    setShowBookingForm(false);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    toast.success('Booking confirmed! Check your email for details.');
    setShowPayment(false);
    setFlights([]);
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  return (
    <div className="container mx-auto p-4 mt-24">
      <FlightSearch 
        onFlightsFound={handleFlightsFound} 
        onSearching={setIsSearching}
        
      />
      {isSearching && (
        <div className="text-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Searching for flights...</p>
        </div>
      )}
      {flights.length > 0 && !isSearching && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Available Flights</h2>
          {flights.map(flight => (
            <FlightCard 
              key={flight.id} 
              flight={flight} 
              onBook={handleBookFlight}
              passengers={passengers}
            />
          ))}
        </div>
      )}
      
      {showBookingForm && (
        <BookingForm
          flight={selectedFlight}
          open={showBookingForm}
          onOpenChange={setShowBookingForm}
          onProceedToPayment={handleProceedToPayment}
        />
      )}
      
      {showPayment && bookingData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>
            <p className="mb-2">Total Amount: ₹{bookingData.totalAmount.toLocaleString()}</p>
            <p className="mb-4 text-sm text-gray-600">Including platform fee of ₹199</p>
            
            <FlightPayButton
              amount={bookingData.totalAmount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              bookingData={bookingData}
            />
            
            <button 
              onClick={() => setShowPayment(false)}
              className="w-full mt-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}