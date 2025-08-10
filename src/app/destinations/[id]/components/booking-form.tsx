"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Users } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface BookingFormProps {
  destination: {
    id: number
    name: string
    price: number
  }
}

export default function BookingForm({ destination }: BookingFormProps) {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    travel_date: undefined as Date | undefined,
    guests: 1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const totalAmount = destination.price * formData.guests

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination_id: destination.id,
          customer_name: formData.customer_name,
          customer_email: formData.customer_email,
          customer_phone: formData.customer_phone,
          travel_date: formData.travel_date?.toISOString().split("T")[0],
          guests: formData.guests,
          total_amount: totalAmount,
        }),
      })

      if (response.ok) {
        toast({
          title: "Booking Successful!",
          description: "Your booking has been submitted. We'll contact you soon with confirmation details.",
        })

        // Reset form
        setFormData({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          travel_date: undefined,
          guests: 1,
        })
      } else {
        throw new Error("Failed to create booking")
      }
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalAmount = destination.price * formData.guests

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="customer_name">Full Name</Label>
        <Input
          id="customer_name"
          value={formData.customer_name}
          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="customer_email">Email Address</Label>
        <Input
          id="customer_email"
          type="email"
          value={formData.customer_email}
          onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="customer_phone">Phone Number</Label>
        <Input
          id="customer_phone"
          type="tel"
          value={formData.customer_phone}
          onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Travel Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.travel_date ? format(formData.travel_date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.travel_date}
              onSelect={(date:any) => setFormData({ ...formData, travel_date: date })}
              disabled={(date:any) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="guests">Number of Guests</Label>
        <Select
          value={formData.guests.toString()}
          onValueChange={(value:any) => setFormData({ ...formData, guests: Number.parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <SelectItem key={num} value={num.toString()}>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  {num} {num === 1 ? "Guest" : "Guests"}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Price per person:</span>
          <span className="font-semibold">${destination.price}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Number of guests:</span>
          <span className="font-semibold">{formData.guests}</span>
        </div>
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Amount:</span>
          <span className="text-blue-600">${totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || !formData.travel_date}>
        {isSubmitting ? "Processing..." : "Book Now"}
      </Button>

      <p className="text-sm text-gray-600 text-center">
        By booking, you agree to our terms and conditions. You'll receive a confirmation email within 24 hours.
      </p>
    </form>
  )
}
