"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link.js";
import TripCard from "./trip-card";
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

export default function DestinationShowcase() {
  return (
    <section
      id="destinations"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">
            Popular Destinations
          </Badge>
        </div>


        {/* Trips Grid */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            { upcomingTrips && upcomingTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </section>

        <Link href='/destinations'>
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white px-8 py-3 rounded-full font-semibold bg-transparent"
            >
              More Destinations
            </Button>
          </div>
        </Link>

      </div>
    </section>
  );
}
