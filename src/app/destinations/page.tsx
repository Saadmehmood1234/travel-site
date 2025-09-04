"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import TripCard from "../components/destination/trip-card";
import { getProducts } from "@/app/actions/product.actions";

interface Trip {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  duration: string;
  dates: string[];
  price: string;
  originalPrice?: string;
  groupSize: string;
  difficulty: string;
  rating: number;
  reviews: number;
  highlights: string[];
  isCommunityTrip: boolean;
  category: string;
  featured: boolean;
  discount: number;
  tripType: "International" | "Domestic"; // Add this line
}

export default function DestinationShowcase() {
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formatDateForDisplay = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  useEffect(() => {
    async function fetchTrips() {
      try {
        setLoading(true);
        setError(null);
        const result = await getProducts();

        if (result.success && result.data) {
          const tripsData = result.data.map((product) => ({
            id: product._id,
            title: product.name,
            subtitle: product.location,
            image: product.image,
            duration: product.duration,
            dates: product.availableDates
              ? product.availableDates.map((date) => {
                  const dateObj =
                    typeof date === "string" ? new Date(date) : date;
                  return formatDateForDisplay(dateObj.toISOString());
                })
              : [],
            price: `₹${product.price.toLocaleString()}`,
            originalPrice: product.originalPrice
              ? `₹${product.originalPrice.toLocaleString()}`
              : undefined,
            groupSize: product.groupSize || "12-15",
            difficulty: product.difficulty || "Moderate",
            rating: product.rating,
            reviews: product.reviews,
            highlights: product.highlights || [],
            isCommunityTrip: product.isCommunityTrip || false,
            category: product.category,
            featured: product.featured,
            discount: product.discount,
            tripType: product.tripType || "Domestic", // Add this line
          }));
          setUpcomingTrips(tripsData);
        } else {
          setError("Failed to load products");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="destinations"
      className="py-20 bg-gradient-to-b mt-12 from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">
            Popular Destinations
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Trips
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of community trips to breathtaking
            destinations around the world.
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>

            {upcomingTrips.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No trips available
                </h3>
                <p className="text-gray-500">
                  Check back later for new adventures!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
