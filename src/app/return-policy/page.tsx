import { AlertTriangle, CalendarX, CloudRain, Clock, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CancellationPolicy() {
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cancellation Policy</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Please review our cancellation terms before booking your trip
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-4xl mx-auto text-gray-600">
          <p className="lead">
            Our cancellation policy is designed to be fair while accounting for operational commitments we make on your behalf when you book a trip.
          </p>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Cancellation Terms
            </h2>
            
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <div className="flex items-start">
                  <Ban className="h-6 w-6 flex-shrink-0 text-red-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">1. Non-Refundable Booking Amount</h3>
                    <p>NO REFUND SHALL BE MADE WITH RESPECT TO THE INITIAL BOOKING AMOUNT FOR ANY CANCELLATIONS.</p>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <div className="flex items-start">
                  <CalendarX className="h-6 w-6 flex-shrink-0 text-amber-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">2. 30+ Days Before Trip</h3>
                    <p>If cancellations are made 30 days before the start date of the trip, 50% of the trip cost will be charged as cancellation fees.</p>
                  </div>
                </div>
              </div>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
                <div className="flex items-start">
                  <Clock className="h-6 w-6 flex-shrink-0 text-orange-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">3. 15-30 Days Before Trip</h3>
                    <p>If cancellations are made 15-30 days before the start date of the trip, 75% of the trip cost will be charged as cancellation fees.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">4. 0-15 Days Before Trip</h3>
                    <p>If cancellations are made within 0-15 days before the start date of the trip, 100% of the trip cost will be charged as cancellation fees.</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <div className="flex items-start">
                  <CloudRain className="h-6 w-6 flex-shrink-0 text-blue-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">5. Weather & Government Restrictions</h3>
                    <p>In the case of unforeseen weather conditions or government restrictions, certain activities may be canceled. In such cases, the operator will try their best to provide an alternate feasible activity. However, no refund will be provided for the same.</p>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                <div className="flex items-start">
                  <CalendarX className="h-6 w-6 flex-shrink-0 text-amber-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">6. Rescheduling Policy</h3>
                    <p>If a rescheduling date request comes within 30 days from the trip date, the booking amount can neither be adjusted to your next date nor refunded.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 p-6 rounded-xl mt-16 border border-primary-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Need Assistance?
            </h2>
            <p>If you have any questions about our cancellation policy or need to discuss a specific situation, please contact our customer support team.</p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/#contact">
                <Button variant="outline" className="border-primary-500 text-primary-600 hover:bg-primary-50">
                  Contact Support
                </Button>
              </Link>
              <Link href="/#faq">
                <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white">
                  Visit FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}