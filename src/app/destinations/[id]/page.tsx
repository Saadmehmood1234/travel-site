"use client";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiStar,
  FiArrowRight,
  FiClock,
  FiHeart,
  FiShare2,
  FiChevronDown,
} from "react-icons/fi";
import ImageGallery from "@/app/components/destination/image-gallery";
import ItineraryDay from "@/app/components/destination/ItineraryDay";
import FAQItem from "@/app/components/destination/faq-item";
import Link from "next/link";

const tripDetails = {
  id: 1,
  title: "Ladakh Bike Trip",
  subtitle: "Ride through the majestic Himalayas",
  images: [
    "https://images.unsplash.com/photo-1581772136272-ef3ccfe4a4e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1581772136272-ef3ccfe4a4e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1581772136272-ef3ccfe4a4e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1581772136272-ef3ccfe4a4e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  ],
  duration: "8 Days",
  difficulty: "Moderate",
  groupSize: "12-15",
  rating: 4.8,
  reviews: 124,
  price: "₹25,999",
  discountPrice: "₹22,999",
  dates: [
    { id: 1, date: "15 Jun 2023", seats: "5 seats left" },
    { id: 2, date: "22 Jun 2023", seats: "8 seats left" },
    { id: 3, date: "29 Jun 2023", seats: "12 seats left" },
  ],
  highlights: [
    "Pangong Lake visit",
    "Khardung La Pass - World's highest motorable road",
    "Nubra Valley camping",
    "Royal Enfield bikes provided",
    "Expert trip leader",
  ],
  overview:
    "This 8-day Ladakh bike trip takes you through some of the most breathtaking landscapes in the Himalayas. Ride through high mountain passes, camp beside pristine lakes, and experience the unique culture of Ladakh. Our carefully curated itinerary ensures you see all the highlights while traveling with a group of like-minded adventurers.",
  itinerary: [
    {
      day: 1,
      title: "Arrival in Leh",
      description:
        "Arrive in Leh and acclimatize to the high altitude. Briefing about the trip in the evening.",
      highlights: ["Leh Palace", "Local market visit"],
      meals: ["Dinner"],
      accommodation: "3-star hotel",
    },
    {
      day: 2,
      title: "Leh to Nubra Valley via Khardung La",
      description:
        "Start early morning for Nubra Valley via Khardung La (18,380 ft). Visit Diskit Monastery and enjoy the sand dunes.",
      highlights: ["Khardung La Pass", "Bactrian camel ride"],
      meals: ["Breakfast", "Dinner"],
      accommodation: "Camp stay",
    },
    // More itinerary days...
  ],
  inclusions: [
    "Royal Enfield bike (fuel included)",
    "All accommodations (hotels & camps)",
    "All meals as per itinerary",
    "Backup vehicle throughout",
    "Oxygen cylinders & first aid kit",
  ],
  exclusions: [
    "Airfare to/from Leh",
    "Personal expenses",
    "Any cost arising from unforeseen circumstances",
    "Travel insurance",
  ],
  faqs: [
    {
      question: "What's the fitness level required?",
      answer:
        "You should be able to ride for 5-6 hours daily. Some prior biking experience is recommended.",
    },
    {
      question: "How cold does it get?",
      answer:
        "Daytime temperatures range from 10-20°C, while nights can drop to 0-5°C in higher areas.",
    },
    // More FAQs...
  ],
};

export default function TripDetailPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
        <div className="container relative z-20 h-full flex items-end px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-3xl text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Community Trip
              </span>
              <span className="flex items-center bg-blue-50 text-blue-800 px-2 py-1 rounded text-sm">
                <FiStar className="text-yellow-500 mr-1" />
                {tripDetails.rating} ({tripDetails.reviews} reviews)
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {tripDetails.title}
            </h1>
            <p className="text-xl md:text-2xl mb-6">{tripDetails.subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <FiCalendar className="mr-2 text-blue-300" />
                <span>{tripDetails.duration}</span>
              </div>
              <div className="flex items-center">
                <FiUsers className="mr-2 text-blue-300" />
                <span>Group: {tripDetails.groupSize}</span>
              </div>
              <div className="flex items-center">
                <FiMapPin className="mr-2 text-blue-300" />
                <span>Difficulty: {tripDetails.difficulty}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:w-2/3">
            {/* Image Gallery */}

            {/* Highlights */}
            <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Trip Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tripDetails.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-blue-100 p-1 rounded-full mr-3 mt-0.5">
                      <FiArrowRight className="text-blue-600" />
                    </div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Overview */}
            <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 mb-4">{tripDetails.overview}</p>
              <button className="text-blue-600 font-medium flex items-center">
                Read more <FiChevronDown className="ml-1" />
              </button>
            </section>

            {/* Itinerary */}
            <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Detailed Itinerary</h2>
              <div className="space-y-6">
                {tripDetails.itinerary.map((day) => (
                  <ItineraryDay key={day.day} day={day} />
                ))}
              </div>
            </section>

            {/* Inclusions & Exclusions */}
            {/* <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-600">Inclusions</h3>
                  <ul className="space-y-2">
                    {tripDetails.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-600">Exclusions</h3>
                  <ul className="space-y-2">
                    {tripDetails.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-red-100 p-1 rounded-full mr-3 mt-0.5">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section> */}

            {/* FAQs */}
            <section className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {tripDetails.faqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:w-1/3">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Price Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm">Starting from</span>
                      <div className="flex items-end">
                        <span className="text-3xl font-bold">
                          {tripDetails.discountPrice}
                        </span>
                        <span className="text-lg line-through ml-2 opacity-80">
                          {tripDetails.price}
                        </span>
                      </div>
                    </div>
                    <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
                      <FiHeart className="text-xl" />
                    </button>
                  </div>
                  <div className="text-sm opacity-90">
                    + ₹1,999 travel insurance (optional)
                  </div>
                </div>

                {/* Dates Selection */}
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold mb-4">
                    Available Dates
                  </h3>
                  <div className="space-y-3">
                    {tripDetails.dates.map((dateItem) => (
                      <div
                        key={dateItem.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:border-blue-500 cursor-pointer"
                      >
                        <div>
                          <div className="font-medium">{dateItem.date}</div>
                          <div className="text-sm text-gray-500">
                            {dateItem.seats}
                          </div>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          Book Now
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Facts */}
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold mb-4">Quick Facts</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration</span>
                      <span className="font-medium">
                        {tripDetails.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty</span>
                      <span className="font-medium">
                        {tripDetails.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Group Size</span>
                      <span className="font-medium">
                        {tripDetails.groupSize}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age Group</span>
                      <span className="font-medium">18-45 years</span>
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="p-6">
                  <Link href="/payment-page">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mb-3 flex items-center justify-center">
                      Book Now <FiArrowRight className="ml-2" />
                    </button>
                  </Link>
                  <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium flex items-center justify-center">
                    Enquire Now
                  </button>
                  <div className="flex justify-center mt-4">
                    <button className="text-gray-500 hover:text-gray-700 flex items-center">
                      <FiShare2 className="mr-2" /> Share this trip
                    </button>
                  </div>
                </div>
              </div>

              {/* Need Help Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold mb-3">Need Help?</h3>
                <p className="text-gray-600 mb-4">
                  Our travel experts are available 24/7 to help you with your
                  booking.
                </p>
                <button className="text-blue-600 font-medium">
                  Chat with us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
