import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

async function getDestinations() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/destinations`, {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Failed to fetch")
    return await res.json()
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return []
  }
}

export default async function DestinationsList() {
  const destinations = await getDestinations()

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination: any) => (
            <Card key={destination.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={destination.image_url || "/placeholder.svg?height=400&width=600"}
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

                <p className="text-gray-600 mb-4 line-clamp-3">{destination.description}</p>

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
