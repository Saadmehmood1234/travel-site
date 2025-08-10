"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Heart, Filter } from "lucide-react"
import Image from "next/image"

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

const categories = ["All", "Beach", "Adventure", "Luxury", "Family-Friendly"]

export default function DestinationShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [favorites, setFavorites] = useState<number[]>([])

  const filteredDestinations =
    selectedCategory === "All" ? destinations : destinations.filter((dest) => dest.category === selectedCategory)

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <section id="destinations" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">Popular Destinations</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Explore Amazing
            <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Destinations
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our handpicked selection of the world's most breathtaking destinations, each offering unique
            experiences and unforgettable memories.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center bg-white rounded-full p-1 shadow-lg">
            <Filter className="h-5 w-5 text-gray-400 ml-3 mr-2" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2 transition-all duration-300 ${
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

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <Card
              key={destination.id}
              className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 shadow-lg hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Discount Badge */}
                {destination.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{destination.discount}%
                  </div>
                )}

                {/* Featured Badge */}
                {destination.featured && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(destination.id)}
                  className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-300"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors duration-300 ${
                      favorites.includes(destination.id) ? "text-red-500 fill-current" : "text-gray-600"
                    }`}
                  />
                </button>

                {/* Price */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">${destination.price}</span>
                    {destination.originalPrice > destination.price && (
                      <span className="text-sm text-gray-500 line-through">${destination.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                    {destination.name}
                  </h3>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-semibold text-gray-700">{destination.rating}</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                  <span className="text-sm">{destination.location}</span>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-2 text-secondary-500" />
                  <span className="text-sm">{destination.duration}</span>
                  <span className="mx-2">•</span>
                  <span className="text-sm">{destination.reviews} reviews</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {destination.category}
                  </Badge>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-full px-6"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white px-8 py-3 rounded-full font-semibold bg-transparent"
          >
            Load More Destinations
          </Button>
        </div>
      </div>
    </section>
  )
}
