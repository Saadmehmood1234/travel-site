'use client'
import { FiCalendar, FiMapPin, FiUsers, FiStar, FiArrowRight } from 'react-icons/fi';
import TripCard from '../components/destination/trip-card';
const upcomingTrips = [
  {
    id: 1,
    title: "Ladakh Bike Trip",
    subtitle: "Ride through the Himalayas",
    image: "https://images.unsplash.com/photo-1581772136272-ef3ccfe4a4e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    duration: "8 Days",
    dates: ["15 Jun 2023", "22 Jun 2023", "29 Jun 2023"],
    price: "₹25,999",
    groupSize: "12-15",
    difficulty: "Moderate",
    rating: 4.8,
    reviews: 124,
    highlights: ["Pangong Lake", "Khardung La Pass", "Nubra Valley"],
    isCommunityTrip: true
  },
  {
    id: 2,
    title: "Spiti Valley Road Trip",
    subtitle: "The Middle Land Adventure",
    image: "https://images.unsplash.com/photo-1581772136272-ef3ccfe4a4e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    duration: "7 Days",
    dates: ["10 Jul 2023", "17 Jul 2023", "24 Jul 2023"],
    price: "₹22,499",
    groupSize: "10-12",
    difficulty: "Challenging",
    rating: 4.9,
    reviews: 98,
    highlights: ["Key Monastery", "Chandratal Lake", "Kunzum Pass"],
    isCommunityTrip: true
  },
  // Add more trips...
];

export default function CommunityTrips() {
  return (
    <div className="bg-gray-50">
      <section className="relative h-96 md:h-[500px] bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
        <img
          src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Group Travel"
          className="w-full h-full object-cover"
        />
        <div className="container relative z-20 h-full flex items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Upcoming Community Trips</h1>
            <p className="text-xl md:text-2xl mb-8">Join like-minded travelers on these incredible group adventures</p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                Browse All Trips <FiArrowRight />
              </button>
              <button className="bg-transparent border-2 border-white/30 hover:border-white/60 text-white px-6 py-3 rounded-full font-medium">
                How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Months</option>
                <option>June 2023</option>
                <option>July 2023</option>
                <option>August 2023</option>
              </select>
              <select className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Destinations</option>
                <option>Ladakh</option>
                <option>Spiti Valley</option>
                <option>Himachal</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Traveler Stories</h2>
          {/* Testimonial cards would go here */}
        </div>
      </section>
    </div>
  );
}