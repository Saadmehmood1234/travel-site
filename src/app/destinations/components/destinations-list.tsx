import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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
    image: "/placeholder.svg?height=400&width=600",
    featured: false,
    discount: 16,
  },
]

export default function DestinationsList() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Card key={destination.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={destination.image || "/placeholder.svg?height=400&width=600"}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                  ${destination.price}
                </div>
                {destination.featured && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">{destination.rating}</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{destination.location}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{destination.duration}</span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">{destination.category}</p>

                <Button asChild className="w-full group">
                  <Link href={`/destinations/${destination.id}`}>
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
