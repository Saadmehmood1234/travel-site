// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import Link from "next/link";
// import TripCard from "./trip-card";
// import { getProducts } from "@/app/actions/product.actions";

// interface Trip {
//   id: string;
//   title: string;
//   subtitle: string;
//   image: string;
//   duration: string;
//   dates: string[];
//   price: string;
//   originalPrice?: string;
//   groupSize: string;
//   difficulty: string;
//   rating: number;
//   reviews: number;
//   highlights: string[];
//   isCommunityTrip: boolean;
//   category: string;
//   featured: boolean;
//   discount: number;
// }

// export default function DestinationShowcase() {
//   const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Function to format dates for display
//   const formatDateForDisplay = (dateString: string): string => {
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//         year: 'numeric'
//       });
//     } catch (error) {
//       console.error('Error formatting date:', error);
//       return dateString; // Return original string if formatting fails
//     }
//   };

//   useEffect(() => {
//     async function fetchTrips() {
//       try {
//         setLoading(true);
//         setError(null);
//         const result = await getProducts();

//         if (result.success && result.data) {
//           const tripsData = result.data.map((product) => ({
//             id: product._id,
//             title: product.name,
//             subtitle: product.location,
//             image: product.image,
//             duration: product.duration,
//             dates: product.availableDates
//               ? product.availableDates.map((date) => {
//                   // Convert to formatted date string for display
//                   const dateObj = typeof date === "string" ? new Date(date) : date;
//                   return formatDateForDisplay(dateObj.toISOString());
//                 })
//               : [],
//             price: `₹${product.price.toLocaleString()}`,
//             originalPrice: product.originalPrice
//               ? `₹${product.originalPrice.toLocaleString()}`
//               : undefined,
//             groupSize: product.groupSize || "12-15",
//             difficulty: product.difficulty || "Moderate",
//             rating: product.rating,
//             reviews: product.reviews,
//             highlights: product.highlights || [],
//             isCommunityTrip: product.isCommunityTrip || true,
//             category: product.category,
//             featured: product.featured,
//             discount: product.discount,
//           }));
//           setUpcomingTrips(tripsData);
//         } else {
//           setError(result.error || "Failed to load products");
//         }
//       } catch (err) {
//         console.error("Error fetching trips:", err);
//         setError("An error occurred while fetching data");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchTrips();
//   }, []);

//   if (loading) {
//     return (
//       <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <Badge className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">
//               Popular Destinations
//             </Badge>
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">
//               Discover Amazing Trips
//             </h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Explore our handpicked selection of community trips to breathtaking
//               destinations around the world.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
//               >
//                 <div className="h-48 bg-gray-300"></div>
//                 <div className="p-6">
//                   <div className="h-6 bg-gray-300 rounded mb-4"></div>
//                   <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
//                   <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
//                   <div className="flex justify-between items-center">
//                     <div className="h-6 bg-gray-300 rounded w-1/3"></div>
//                     <div className="h-10 bg-gray-300 rounded w-1/3"></div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="text-red-500 mb-4">Error: {error}</div>
//           <Button onClick={() => window.location.reload()}>Try Again</Button>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section
//       id="destinations"
//       className="py-20 bg-gradient-to-b from-gray-50 to-white"
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <Badge className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">
//             Popular Destinations
//           </Badge>
//           <h2 className="text-4xl font-bold text-gray-900 mb-4">
//             Discover Amazing Trips
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Explore our handpicked selection of community trips to breathtaking
//             destinations around the world.
//           </p>
//         </div>

//         {upcomingTrips.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {upcomingTrips.map((trip) => (
//               <TripCard key={trip.id} trip={trip} />
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <div className="max-w-md mx-auto">
//               <div className="mb-6">
//                 <svg
//                   className="w-24 h-24 mx-auto text-gray-300"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={1.5}
//                     d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-semibold text-gray-700 mb-4">
//                 No Trips Available
//               </h3>
//               <p className="text-gray-500 mb-6">
//                 We're currently preparing new adventures for you. Check back soon for exciting trips!
//               </p>
//               <div className="space-y-3">
//                 <p className="text-sm text-gray-400">
//                   In the meantime, you can:
//                 </p>
//                 <ul className="text-sm text-gray-400 space-y-1">
//                   <li>• Explore our travel guides</li>
//                   <li>• Join our community forum</li>
//                   <li>• Sign up for trip notifications</li>
//                 </ul>
//               </div>
//               <div className="mt-8 space-x-4">
                
//                 <Button asChild>
//                   <Link href="/#contact">
//                     Contact Us
//                   </Link>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import TripCard from "./trip-card";
import { getProducts } from "@/app/actions/product.actions";
import { Filter, ChevronDown } from "lucide-react";

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
}

// Define categories based on your product data
const categories = ["All", "Beach", "Adventure", "Luxury", "Family-Friendly"];

export default function DestinationShowcase() {
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Function to format dates for display
  const formatDateForDisplay = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
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
                  const dateObj = typeof date === "string" ? new Date(date) : date;
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
          }));
          setUpcomingTrips(tripsData);
          setFilteredTrips(tripsData);
        } else {
          setError(result.error || "Failed to load products");
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  // Filter trips based on selected category
  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredTrips(upcomingTrips);
    } else {
      const filtered = upcomingTrips.filter(
        (trip) => trip.category === selectedCategory
      );
      setFilteredTrips(filtered);
    }
  }, [selectedCategory, upcomingTrips]);

  if (loading) {
    return (
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <Badge className="mb-3 md:mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">
              Popular Destinations
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Trips
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of community trips to breathtaking
              destinations around the world.
            </p>
          </div>

          {/* Filter skeleton */}
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
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
      className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <Badge className="mb-3 md:mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">
            Popular Destinations
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Trips
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of community trips to breathtaking
            destinations around the world.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
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
              className={`h-4 w-4 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} 
            />
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} md:flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12`}>
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
                  className={`rounded-full px-3 py-2 text-sm md:px-4 md:py-2 md:text-base transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {filteredTrips.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
            
            {/* Show message when no trips match filter */}
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
                    We don't have any {selectedCategory.toLowerCase()} trips available at the moment.
                    Try selecting a different category or check back later.
                  </p>
                  <Button
                    onClick={() => setSelectedCategory("All")}
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 text-sm md:text-base"
                  >
                    View All Trips
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
                We're currently preparing new adventures for you. Check back soon for exciting trips!
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
                  <Link href="/#contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}