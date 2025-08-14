import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import BookingForm from "./booking-form"

// Static destinations array (same as in DestinationsList)
const destinations = [
  {
    id: 1,
    name: "Tropical Paradise Bali",
    location: "Bali, Indonesia",
    price: 1299,
    originalPrice: 1599,
    rating: 4.8,
    reviews: 324,
    duration: "7 days",
    category: "Beach",
    description:
      "Experience the beauty of Bali with pristine beaches, vibrant culture, and world-class resorts.",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    discount: 19,
  },
  {
    id: 2,
    name: "Swiss Alps Adventure",
    location: "Switzerland",
    price: 2199,
    originalPrice: 2499,
    rating: 4.9,
    reviews: 156,
    duration: "10 days",
    category: "Adventure",
    description:
      "Enjoy breathtaking views, snowy peaks, and thrilling outdoor adventures in the Swiss Alps.",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    discount: 12,
  },
  {
    id: 3,
    name: "Luxury Maldives Resort",
    location: "Maldives",
    price: 3499,
    originalPrice: 4299,
    rating: 4.9,
    reviews: 89,
    duration: "5 days",
    category: "Luxury",
    description:
      "Relax in an overwater villa surrounded by turquoise waters in a private luxury resort.",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    discount: 19,
  },
  {
    id: 4,
    name: "Tokyo Cultural Journey",
    location: "Tokyo, Japan",
    price: 1899,
    originalPrice: 2199,
    rating: 4.7,
    reviews: 267,
    duration: "8 days",
    category: "Family-Friendly",
    description:
      "Dive into Japan’s rich culture, vibrant streets, and unique culinary experiences.",
    image: "/placeholder.svg?height=400&width=600",
    featured: true,
    discount: 14,
  },
  {
    id: 5,
    name: "African Safari Experience",
    location: "Kenya & Tanzania",
    price: 3299,
    originalPrice: 3899,
    rating: 4.9,
    reviews: 134,
    duration: "12 days",
    category: "Adventure",
    description:
      "Witness majestic wildlife up close in an unforgettable African safari experience.",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    discount: 15,
  },
  {
    id: 6,
    name: "Santorini Sunset Escape",
    location: "Santorini, Greece",
    price: 1599,
    originalPrice: 1899,
    rating: 4.6,
    reviews: 198,
    duration: "6 days",
    category: "Beach",
    description:
      "Enjoy breathtaking sunsets, whitewashed villages, and the charm of the Greek islands.",
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    discount: 16,
  },
]

interface DestinationDetailProps {
  id: string
}

export default function DestinationDetail({ id }: DestinationDetailProps) {
  const destination = destinations.find((d) => d.id === Number(id))

  if (!destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Destination not found</h1>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Destination Info */}
        <div>
          <div className="relative h-96 rounded-xl overflow-hidden mb-6">
            <Image
              src={destination.image || "/placeholder.svg?height=600&width=800"}
              alt={destination.name}
              fill
              className="object-cover"
            />
            {destination.featured && (
              <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Featured
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{destination.name}</h1>

              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">{destination.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">{destination.duration}</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="text-gray-700">{destination.rating}</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-blue-600 mb-6">
                ${destination.price}
                <span className="text-lg font-normal text-gray-600"> per person</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Destination</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{destination.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Included</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Accommodation for {destination.duration}
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Professional tour guide
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Transportation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Selected meals
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Travel insurance
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div>
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Your Trip</h2>
              <BookingForm destination={destination} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
