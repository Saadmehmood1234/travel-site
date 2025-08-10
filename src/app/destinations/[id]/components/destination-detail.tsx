import { Card, CardContent } from "@/components/ui/card"
import { Star, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import BookingForm from "./booking-form"

async function getDestination(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/destinations/${id}`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Failed to fetch")
    return await res.json()
  } catch (error) {
    console.error("Error fetching destination:", error)
    return null
  }
}

interface DestinationDetailProps {
  id: string
}

export default async function DestinationDetail({ id }: DestinationDetailProps) {
  const destination = await getDestination(id)

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
              src={destination.image_url || "/placeholder.svg?height=600&width=800"}
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
