import { ClipboardList, Hotel, Map, Shield, AlertTriangle, CreditCard, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TermsConditions() {
  return (
    <div className="bg-white mt-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <ClipboardList className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            Please read these terms carefully before booking your trip with Cloudship Holidays
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-4xl mx-auto text-gray-600">
          <p className="lead font-medium">
            By submitting a quotation request or confirming a booking with Cloudship Holidays, you agree to the following terms and conditions:
          </p>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="h-6 w-6 mr-3 text-primary-600" />
              Communication Consent
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p>By filling out our online forms, you authorize Cloudship Holidays to contact you on the provided number via calls or SMS for promotional purposes. These communications may be routed through third-party systems.</p>
            </div>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Hotel className="h-6 w-6 mr-3 text-primary-600" />
              Hotel Policies
            </h2>
            <ul className="space-y-4 list-disc pl-6">
              <li>Hotel check-in/check-out times differ based on the destination. Early check-ins and late check-outs are subject to the hotel's discretion. We can request it on your behalf but cannot assure approval.</li>
              <li>Cloudship Holidays is not responsible if the hotel denies such requests at the time of stay, even if it was tentatively agreed upon earlier.</li>
            </ul>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Map className="h-6 w-6 mr-3 text-primary-600" />
              Itinerary and Activities
            </h2>
            <ul className="space-y-4 list-disc pl-6">
              <li>All travel plans are fixed as per the confirmed itinerary. Transportation will be arranged accordingly and will not be available for personal use outside the mentioned plan.</li>
              <li>If any prepaid activity is cancelled due to unforeseen reasons, we will attempt to provide a similar alternative. If that isn't possible, we will process a refund (equivalent to what Cloudship Holidays paid), which will be credited within 30 days of processing.</li>
              <li>Complimentary activities hold no monetary value and are not eligible for refunds in any situation.</li>
            </ul>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Globe className="h-6 w-6 mr-3 text-primary-600" />
              Local Rules & Limitations
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p>We are not responsible for any limitations or service conditions imposed by local operators or unions, such as:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Non-functioning ACs in hilly regions</li>
                <li>Extra charges for heaters</li>
                <li>Use of local taxis for specific sites</li>
                <li>Houseboats operating only during daylight hours</li>
              </ul>
            </div>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="h-6 w-6 mr-3 text-primary-600" />
              Exclusions & Charges
            </h2>
            <ul className="space-y-4 list-disc pl-6">
              <li>Package prices do not include entrance fees, guide charges, or parking unless specifically stated.</li>
              <li>For multi-airline flight itineraries, guests may need to collect and recheck their luggage at transit points.</li>
              <li>All airline seats and hotel bookings are based on availability and pricing at the time of actual booking and are subject to change without prior notice.</li>
            </ul>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <AlertTriangle className="h-6 w-6 mr-3 text-primary-600" />
              Force Majeure & Natural Events
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p>If trips are impacted or cancelled due to natural disasters, strikes, political unrest, or any force majeure event, Cloudship Holidays will attempt to refund as much as possible based on our discussions with vendors. However, we cannot promise a full refund in such cases.</p>
            </div>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Shield className="h-6 w-6 mr-3 text-primary-600" />
              Data Usage
            </h2>
            <ul className="space-y-4 list-disc pl-6">
              <li>Your contact details may be used to share promotional content, service updates, or offers from Cloudship Holidays. We do not sell or distribute your personal information to third parties, except our tech partners for operational purposes.</li>
              <li>Identity documents collected during booking are strictly used for remittances and reservation formalities.</li>
            </ul>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <CreditCard className="h-6 w-6 mr-3 text-primary-600" />
              Payment Policies
            </h2>
            <ul className="space-y-4 list-disc pl-6">
              <li>Full payment must be completed before the trip begins. On-ground or post-arrival payments are not accepted.</li>
              <li>Bookings may be cancelled without refund if payment terms are violated or installments are delayed. However, prior notice will be given before such cancellation.</li>
              <li>Cloudship Holidays charges a cancellation fee of ₹2,999 per person in case of voluntary cancellation by the customer.</li>
            </ul>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Globe className="h-6 w-6 mr-3 text-primary-600" />
              Jurisdiction
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p>Any disputes shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.</p>
            </div>
          </div>

          <div className="bg-primary-50 p-6 rounded-xl mt-16 border border-primary-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Need Clarification?
            </h2>
            <p>If you have any questions about our terms and conditions, please contact our customer support team before making a booking.</p>
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