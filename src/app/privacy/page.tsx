import { Shield, Lock, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrivacyPolicy() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            At Cloudship Holidays, safeguarding your privacy is one of our top priorities.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-4xl mx-auto text-gray-600">
          <p className="lead">
            This document explains how we collect, manage, use, and protect the personal data you share with us during your interactions with our company.
          </p>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Lock className="h-6 w-6 mr-3 text-primary-600" />
              Information We Collect
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">1. Personal Details</h3>
                <p>When you use our services or make a booking, we may collect personal identifiers such as your name, contact number, email address, and payment information.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">2. Travel Preferences</h3>
                <p>We may ask about your travel interests, preferred destinations, and trip expectations to offer you customized travel experiences.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">3. Communication Records</h3>
                <p>This includes messages, inquiries, or any form of contact made with our team via calls, emails, chat platforms, or social media.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">4. Website Interaction Data</h3>
                <p>We may track non-personal information like your IP address, the device or browser you use, and the pages you visit on our website to enhance user experience and site performance.</p>
              </div>
            </div>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
            <ul className="space-y-4 list-disc pl-6">
              <li>
                <span className="font-semibold">Booking & Service Fulfillment:</span> Your information enables us to process your bookings, send confirmations, and support you throughout your journey.
              </li>
              <li>
                <span className="font-semibold">Personalized Experience:</span> We use collected preferences to tailor services and suggest relevant travel options just for you.
              </li>
              <li>
                <span className="font-semibold">Promotional Communication:</span> With your permission, we may occasionally send updates on exclusive offers, travel deals, or new services via email or SMS.
              </li>
              <li>
                <span className="font-semibold">Performance Improvement:</span> Analyzing usage data helps us optimize our website functionality, user experience, and service offerings.
              </li>
              <li>
                <span className="font-semibold">Legal and Regulatory Use:</span> Your data may be used to meet legal obligations, resolve disputes, or comply with lawful authorities if necessary.
              </li>
            </ul>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Information Sharing</h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">1. Trusted Third Parties</h3>
                <p>We may engage reliable external service providers (e.g., payment gateways, advertising platforms, or tech support teams) to perform functions on our behalf. These parties only access data needed to perform their duties and are bound by confidentiality.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">2. Legal Disclosures</h3>
                <p>We may disclose information if required by law, legal proceedings, or in the interest of safety, fraud prevention, or protection of rights.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">3. Business Transitions</h3>
                <p>In case of restructuring, mergers, or company acquisitions, user information may be included as part of the transferred assets.</p>
              </div>
            </div>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Retention</h2>
            <p>We keep your information only as long as it's necessary to serve the purposes mentioned above, unless legal or business requirements mandate a longer storage period.</p>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Privacy Rights</h2>
            <p>You have the right to:</p>
            <ul className="space-y-2 list-disc pl-6 mt-2">
              <li>Access your personal data</li>
              <li>Request corrections or deletion</li>
              <li>Object to or limit processing</li>
              <li>Request data portability</li>
            </ul>
            <p className="mt-4">You can opt-out of promotional emails anytime by clicking the "unsubscribe" link in our communications.</p>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Protection & Security</h2>
            <p>We employ advanced security protocols to prevent unauthorized access or misuse of your data. However, while we strive for complete safety, no system can be completely foolproof when it comes to data transmission over the internet.</p>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Underage Users</h2>
            <p>Our services are intended for users above the age of 18. We do not knowingly gather personal data from minors. If we become aware of such activity, we will take prompt action to delete the information.</p>
          </div>

          <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Policy Revisions</h2>
            <p>This privacy policy may be updated periodically to reflect changes in our operations or legal obligations. Revisions will be posted on this page, and we encourage users to review it regularly.</p>
          </div>

          <div className="bg-primary-50 p-6 rounded-xl mt-16 border border-primary-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-primary-600" />
              Contact Us
            </h2>
            <p>For questions or concerns related to your privacy or this policy, please reach out to us at:</p>
            <div className="mt-4">
              <Link href="mailto:info@cloudshipholidays.com" className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium">
                <Mail className="h-5 w-5 mr-2" />
                info@cloudshipholidays.com
              </Link>
            </div>
            <div className="mt-2">
              <Link href="tel:+1234567890" className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium">
                <Phone className="h-5 w-5 mr-2" />
                +91-9310682414
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}