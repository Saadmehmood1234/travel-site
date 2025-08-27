import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Calendar, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden ">
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Beautiful travel destination"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Discover Your Next
          <span className="text-blue-400 block">Adventure</span>
        </h1>
        <p className="text-xl sm:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
          Explore breathtaking destinations, create unforgettable memories, and embark on the journey of a lifetime with
          our curated travel experiences.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
            <Link href="/destinations" className="flex items-center">
              Explore Destinations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg bg-transparent"
          >
            Plan Your Trip
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center">
            <MapPin className="h-8 w-8 text-blue-400 mb-2" />
            <div className="text-3xl font-bold">50+</div>
            <div className="text-gray-300">Destinations</div>
          </div>
          <div className="flex flex-col items-center">
            <Users className="h-8 w-8 text-blue-400 mb-2" />
            <div className="text-3xl font-bold">10K+</div>
            <div className="text-gray-300">Happy Travelers</div>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="h-8 w-8 text-blue-400 mb-2" />
            <div className="text-3xl font-bold">5+</div>
            <div className="text-gray-300">Years Experience</div>
          </div>
        </div>
      </div>
    </div>
  )
}
