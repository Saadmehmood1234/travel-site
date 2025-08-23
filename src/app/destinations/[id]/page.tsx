"use client";
import { useState, useEffect, useTransition, startTransition } from "react";
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
import { useParams, useRouter } from "next/navigation";
import { getProductById } from "@/app/actions/product.actions";
import { SerializedProduct } from "@/types/product";
import { useSession } from "next-auth/react";
import { toggleWishlist } from "@/app/actions/wishlist.actions.ts";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
interface TripDetails {
  id: string;
  title: string;
  location: string;
  images: string[];
  duration: string;
  difficulty: string;
  groupSize: string;
  rating: number;
  reviews: number;
  price: string;
  discountPrice?: string;
  dates: { id: string; date: string; seats: string }[];
  highlights: string[];
  overview: string;
  itinerary: string[]
  inclusions: string[];
  exclusions: string[];
  category:string
   featured: boolean;
    discount: number;
    availableDates: Date[]; 
    isCommunityTrip: boolean;    
  faqs: { question: string; answer: string }[];
}

export default function TripDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();
  const router = useRouter();
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    async function fetchTripDetails() {
      try {
        setLoading(true);
        const result = await getProductById(id);

        if (result.success && result.data) {
          const product = result.data;

          const transformedData: TripDetails = {
            id: product._id,
            category:product.category,
            availableDates:product.availableDates,
            isCommunityTrip:product.isCommunityTrip,
            title: product.name,
            location: product.location,
             featured: product.featured,
             discount: product.discount,
            itinerary:product.itinerary,
            images: [product.image],
            duration: product.duration,
            difficulty: product.difficulty || "Moderate",
            groupSize: product.groupSize || "12-15",
            rating: product.rating,
            reviews: product.reviews,
            price: `₹${
              product.originalPrice?.toLocaleString() ||
              product.price.toLocaleString()
            }`,
            discountPrice: product.originalPrice
              ? `₹${product.price.toLocaleString()}`
              : undefined,
            dates:
              product.availableDates && product.availableDates.length > 0
                ? product.availableDates.map((dateStr, index) => ({
                    id: index.toString(),
                    date: new Date(dateStr).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }),
                    seats: "Available",
                  }))
                : [
                    {
                      id: "1",
                      date: "Custom dates available",
                      seats: "Contact for details",
                    },
                  ],
            highlights: product.highlights || [
              "Expert guides",
              "Small group experience",
              "All equipment provided",
            ],
            overview: `Experience the amazing ${product.name} in ${product.location}. ${product.duration} of adventure and exploration awaits you.`,
            inclusions: product.inclusions || [
              "Professional guides",
              "All necessary equipment",
              "Accommodation as per itinerary",
              "Meals as specified",
            ],
            exclusions: product.exclusions || [
              "Personal expenses",
              "Travel insurance",
              "Optional activities",
            ],
            faqs: [
              {
                question: "What should I bring?",
                answer:
                  "Comfortable clothing, sturdy shoes, personal medications, and a sense of adventure!",
              },
              {
                question: "What's the cancellation policy?",
                answer:
                  "Full refund up to 30 days before departure. Please see our terms for details.",
              },
            ],
          };

          setTripDetails(transformedData);
        } else {
          setError(result.error || "Product not found");
        }
      } catch (err) {
        console.error("Error fetching trip details:", err);
        setError("Failed to load trip details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchTripDetails();
    }
  }, [id]);
  const handleToggleFavorite = (productId: string) => {
    const isCurrentlyFavorite = favorites.includes(productId);

    setFavorites((prev) =>
      isCurrentlyFavorite
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    startTransition(async () => {
      try {
        const result = await toggleWishlist(productId);

        if (result.status === "error") {
          setFavorites((prev) =>
            isCurrentlyFavorite
              ? [...prev, productId]
              : prev.filter((id) => id !== productId)
          );
          toast.error(result.message);
        } else {
          toast.success(
            isCurrentlyFavorite ? "Removed from wishlist" : "Added to wishlist"
          );
        }
      } catch (error) {
        setFavorites((prev) =>
          isCurrentlyFavorite
            ? [...prev, productId]
            : prev.filter((id) => id !== productId)
        );
        toast.error("Failed to update wishlist");
      }
    });
  };
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tripDetails?.title || "Amazing Trip",
          text: tripDetails?.location || "Check out this amazing trip!",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !tripDetails) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error || "Trip not found"}</p>
          <Link href="/destinations">
            <button className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-2 rounded-lg">
              Back to Destinations
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <section className="relative h-96 md:h-[500px] bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${tripDetails.images[0]})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
        <div className="container relative z-20 h-full flex items-end px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-3xl text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
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
            <p className="text-xl md:text-2xl mb-6">{tripDetails.location}</p>
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="mb-8">
              <ImageGallery images={tripDetails.images} />
            </div>
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

            <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 mb-4">{tripDetails.overview}</p>
              <button className="text-blue-600 font-medium flex items-center">
                Read more <FiChevronDown className="ml-1" />
              </button>
            </section>

            <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">Detailed Itinerary</h2>
              <div className="space-y-6">
                {tripDetails.itinerary}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-green-600">
                    Inclusions
                  </h3>
                  <ul className="space-y-2">
                    {tripDetails.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-green-100 p-1 rounded-full mr-3 mt-0.5">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-600">
                    Exclusions
                  </h3>
                  <ul className="space-y-2">
                    {tripDetails.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-red-100 p-1 rounded-full mr-3 mt-0.5">
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
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

          <div className="lg:w-1/3">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm">Starting from</span>
                      <div className="flex items-end">
                        <span className="text-3xl font-bold">
                          {tripDetails.discountPrice || tripDetails.price}
                        </span>
                        {tripDetails.discountPrice && (
                          <span className="text-lg line-through ml-2 opacity-80">
                            {tripDetails.price}
                          </span>
                        )}
                      </div>
                    </div>
                     <button onClick={() =>
                        handleToggleFavorite(tripDetails.id.toString())
                      } className="p-2 rounded-full bg-white/20 hover:bg-white/30">
                      <FiHeart               className={`h-5 w-5 transition-colors duration-300 ${
                          favorites.includes(tripDetails.id.toString())
                            ? "text-red-500 fill-current"
                            : "text-gray-600"
                        }`} />
                    </button>
                  </div>
                  <div className="text-sm opacity-90">
                    + Travel insurance (optional)
                  </div>
                </div>

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

                <div className="p-6">
                  <Link href={`/payment-page/${tripDetails.id}`}>
                    <button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold mb-3 flex items-center justify-center">
                      Book Now <FiArrowRight className="ml-2" />
                    </button>
                  </Link>
                  <button className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-medium flex items-center justify-center">
                    Enquire Now
                  </button>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={handleShare}
                      className="text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      <FiShare2 className="mr-2" /> Share this trip
                    </button>
                  </div>
                </div>
              </div>

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
