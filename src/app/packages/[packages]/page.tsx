"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const TripCard = dynamic(
  () => import("@/app/components/destination/trip-card"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
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
    ),
  }
);

interface DestinationPageProps {
  params: {
    packages: string;
  };
}

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

interface Product {
  _id: string;
  name: string;
  location: string;
  image: string;
  duration: string;
  availableDates?: (string | Date)[];
  price: number;
  originalPrice?: number;
  groupSize?: string;
  difficulty?: string;
  rating: number;
  reviews: number;
  highlights?: string[];
  isCommunityTrip?: boolean;
  category: string;
  featured: boolean;
  discount: number;
  tripType?: "International" | "Domestic";
}

interface ApiResponse {
  success: boolean;
  data?: Product[];
  message?: string;
}

export default function DestinationPage() {
  const params = useParams();
  const { packages } = params;

  const decodedDestination = decodeURIComponent(packages as string);
  const formattedDestination = decodedDestination.charAt(0).toUpperCase() + 
                              decodedDestination.slice(1).toLowerCase();
  const [destinationTrips, setDestinationTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const { getProducts } = await import("@/app/actions/product.actions");
        const result: ApiResponse = await getProducts();

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
        if (result.success && result.data) {
          const filteredTrips = result.data
            .filter(
              (product) =>
                product.location
                  ?.toLowerCase()
                  .includes(decodedDestination.toLowerCase()) ||
                product.name
                  ?.toLowerCase()
                  .includes(decodedDestination.toLowerCase()) ||
                product.category
                  ?.toLowerCase()
                  .includes(decodedDestination.toLowerCase())
            )
            .map((product) => ({
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
              tripType: product.tripType || "Domestic",
            }));

          setDestinationTrips(filteredTrips);
        } else {
          setError(result.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [decodedDestination]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <div className="text-center mb-8">
              <Badge className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">
                Destination
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {formattedDestination} Tours & Packages
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover amazing travel experiences in {formattedDestination}
              </p>
            </div>
          </div>

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
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">Error</h2>
            <p className="text-gray-500 mt-2 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="text-center mb-8">
            <Badge className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">
              Destination
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {formattedDestination} Tours & Packages
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover amazing travel experiences in {formattedDestination}
            </p>
          </div>
        </div>

        {destinationTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinationTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">
              No packages found for "{formattedDestination}"
            </h2>
            <p className="text-gray-500 mt-2 mb-4">
              We couldn't find any trips matching your search. Please try:
            </p>
            <div className="space-y-2 text-gray-600 mb-6">
              <p>• Checking your spelling</p>
              <p>• Using more general terms</p>
              <p>• Browsing our popular destinations</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline">Browse All Destinations</Button>
              </Link>
              <Link href="/contact">
                <Button>Request Custom Trip</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}