'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from './actions/order.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data for products (replace with your actual data fetching)
const mockProducts = [
  { _id: '1', name: 'Beach Paradise', location: 'Maldives', price: 299 },
  { _id: '2', name: 'Mountain Adventure', location: 'Switzerland', price: 499 },
  { _id: '3', name: 'City Explorer', location: 'Tokyo', price: 399 },
];

interface TripItem {
  product: string;
  name: string;
  location: string;
  quantity: number;
  price: number;
  selectedDate: Date | undefined;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trips, setTrips] = useState<TripItem[]>([
    { product: '', name: '', location: '', quantity: 1, price: 0, selectedDate: undefined }
  ]);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'upi' | 'paypal' | 'cash'>('credit-card');

  // Calculate total amount
  const totalAmount = trips.reduce((total, trip) => {
    return total + (trip.price * trip.quantity);
  }, 0);

  const handleAddTrip = () => {
    setTrips([...trips, { product: '', name: '', location: '', quantity: 1, price: 0, selectedDate: undefined }]);
  };

  const handleRemoveTrip = (index: number) => {
    if (trips.length === 1) return;
    const newTrips = [...trips];
    newTrips.splice(index, 1);
    setTrips(newTrips);
  };

  const handleTripChange = (index: number, field: keyof TripItem, value: any) => {
    const newTrips = [...trips];
    newTrips[index] = { ...newTrips[index], [field]: value };
    setTrips(newTrips);
  };

  const handleProductSelect = (index: number, productId: string) => {
    const product = mockProducts.find(p => p._id === productId);
    if (product) {
      const newTrips = [...trips];
      newTrips[index] = {
        ...newTrips[index],
        product: productId,
        name: product.name,
        location: product.location,
        price: product.price
      };
      setTrips(newTrips);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      setError('Please fill in all contact information');
      setLoading(false);
      return;
    }

    for (let i = 0; i < trips.length; i++) {
      const trip = trips[i];
      if (!trip.product || !trip.selectedDate) {
        setError(`Please select a product and date for trip ${i + 1}`);
        setLoading(false);
        return;
      }
    }

    try {
      // In a real app, you'd get the userId from authentication/session
      const userId = '65d8f7c8b6c12b4f9c8e7d3a'; // Mock user ID

      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('trips', JSON.stringify(trips));
      formData.append('totalAmount', totalAmount.toString());
      formData.append('paymentMethod', paymentMethod);
      formData.append('contactInfo', JSON.stringify(contactInfo));
      formData.append('specialRequests', specialRequests);

      const result = await createOrder(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        router.push(`/`);
      }
    } catch (err) {
      setError('Failed to create order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Order</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Trip Details</span>
              <Button type="button" onClick={handleAddTrip} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" /> Add Trip
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trips.map((trip, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 relative">
                {trips.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleRemoveTrip(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`product-${index}`}>Select Trip</Label>
                    <Select
                      value={trip.product}
                      onValueChange={(value) => handleProductSelect(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a trip" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.name} - {product.location} (${product.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !trip.selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {trip.selectedDate ? format(trip.selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={trip.selectedDate}
                          onSelect={(date) => handleTripChange(index, 'selectedDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {trip.product && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={trip.quantity}
                        onChange={(e) => handleTripChange(index, 'quantity', parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`price-${index}`}>Price per person</Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        value={trip.price}
                        readOnly
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`total-${index}`}>Total for this trip</Label>
                      <Input
                        id={`total-${index}`}
                        type="number"
                        value={trip.price * trip.quantity}
                        readOnly
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Full Name</Label>
                <Input
                  id="contact-name"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Phone</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Special Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="special-requests">Any special requests or requirements?</Label>
              <textarea
                id="special-requests"
                className="w-full min-h-[100px] border rounded-md p-2"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(value: any) => setPaymentMethod(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="total-amount">Total Amount</Label>
                <Input
                  id="total-amount"
                  type="number"
                  value={totalAmount}
                  readOnly
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Order...' : 'Create Order'}
          </Button>
        </div>
      </form>
    </div>
  );
}