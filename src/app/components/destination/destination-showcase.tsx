"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import TripCard from "./trip-card";
import { getProducts } from "@/app/actions/product.actions";
import { Filter, ChevronDown } from "lucide-react";
import { SectionWrapper } from "@/app/components/ui/section-wrapper";
import { SectionHeader } from "@/app/components/ui/section-header";

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
  tripType: "International" | "Domestic";
}

const categories = ["All", "Beach", "Adventure", "Luxury", "Family-Friendly"];

export default function DestinationShowcase() {
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [displayedTrips, setDisplayedTrips] = useState<Trip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
            isCommunityTrip: product.isCommunityTrip || true,
            category: product.category,
            featured: product.featured,
            discount: product.discount,
            tripType: product.tripType || "Domestic",
          }));
          setUpcomingTrips(tripsData);
          setFilteredTrips(tripsData);
          setDisplayedTrips(tripsData.slice(0, 6));
        } else {
          setError(result.error || "Failed to load products");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      const filtered = upcomingTrips;
      setFilteredTrips(filtered);
      setDisplayedTrips(filtered.slice(0, 6)); 
    } else {
      const filtered = upcomingTrips.filter(
        (trip) => trip.category === selectedCategory
      );
      setFilteredTrips(filtered);
      setDisplayedTrips(filtered.slice(0, 6));
    }
  }, [selectedCategory, upcomingTrips]);

  if (loading) {
    return (
      <SectionWrapper background="gradient">
        <SectionHeader
          badge="Popular Destinations"
          title="Discover Amazing Trips"
          subtitle="Explore our handpicked selection of community trips to breathtaking destinations around the world."
        />
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12">
            <div className="flex items-center bg-white rounded-full p-1 shadow-lg animate-pulse w-full md:w-auto">
              <div className="h-5 w-5 bg-gray-300 rounded ml-3 mr-2"></div>
              {categories.map((category) => (
                <div
                  key={category}
                  className="h-8 md:h-10 bg-gray-300 rounded-full px-4 md:px-6 mx-1 hidden md:block"
                ></div>
              ))}
              <div className="h-8 bg-gray-300 rounded-full px-4 mx-1 md:hidden w-32"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="h-40 sm:h-48 bg-gray-300"></div>
                <div className="p-4 sm:p-6">
                  <div className="h-5 sm:h-6 bg-gray-300 rounded mb-3 sm:mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-3 sm:mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 sm:h-6 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-8 sm:h-10 bg-gray-300 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionWrapper>
      );
    }

  if (error) {
    return (
      <SectionWrapper background="gradient">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="destinations" background="gradient">
      <SectionHeader
        badge="Popular Destinations"
        title="Discover Amazing Trips"
        subtitle="Explore our handpicked selection of community trips to breathtaking destinations around the world."
      />
        <div className="md:hidden mb-6">
          <Button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between bg-white text-gray-700 border border-gray-200 shadow-sm"
          >
            <span className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Category
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showMobileFilters ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
        <div
          className={`${
            showMobileFilters ? "block" : "hidden"
          } md:flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12`}
        >
          <div className="flex flex-col md:flex-row md:items-center bg-white rounded-lg md:rounded-full p-2 md:p-1 shadow-lg w-full md:w-auto">
            <div className="hidden md:flex items-center">
              <Filter className="h-5 w-5 text-gray-400 ml-3 mr-2" />
            </div>
            <div className="grid grid-cols-2 gap-2 md:flex md:gap-0">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "ghost"}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowMobileFilters(false);
                  }}
                  className={`rounded-full px-4 py-2.5 text-sm md:px-6 md:py-3 md:text-base transition-all duration-300 ${
                    selectedCategory === category
                      ? "btn-primary shadow-lg"
                      : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {displayedTrips.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {displayedTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
            
            {/* Show View All button if there are more than 6 trips */}
            {filteredTrips.length > 6 && (
              <div className="text-center mt-8 md:mt-12">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary-500 to-secondary-500">
                  <Link href="/destinations">
                    View All 
                  </Link>
                </Button>
              </div>
            )}
            
            {selectedCategory !== "All" && filteredTrips.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <div className="max-w-md mx-auto">
                  <div className="mb-4 md:mb-6">
                    <svg
                      className="w-16 h-16 md:w-24 md:h-24 mx-auto text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3 md:mb-4">
                    No {selectedCategory} Trips Found
                  </h3>
                  <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">
                    We don't have any {selectedCategory.toLowerCase()} trips
                    available at the moment. Try selecting a different category
                    or check back later.
                  </p>
                  <Button
                    onClick={() => setSelectedCategory("All")}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 text-sm md:text-base"
                  >
                    View All 
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 md:py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-4 md:mb-6">
                <svg
                  className="w-16 h-16 md:w-24 md:h-24 mx-auto text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3 md:mb-4">
                No Trips Available
              </h3>
              <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">
                We're currently preparing new adventures for you. Check back
                soon for exciting trips!
              </p>
              <div className="space-y-2 mb-4 md:mb-6">
                <p className="text-xs md:text-sm text-gray-400">
                  In the meantime, you can:
                </p>
                <ul className="text-xs md:text-sm text-gray-400 space-y-1">
                  <li>• Explore our travel guides</li>
                  <li>• Join our community forum</li>
                  <li>• Sign up for trip notifications</li>
                </ul>
              </div>
              <div className="mt-6 space-x-3">
                <Button asChild size="sm" className="text-xs md:text-sm">
                  <Link href="/#contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </SectionWrapper>
    );
}