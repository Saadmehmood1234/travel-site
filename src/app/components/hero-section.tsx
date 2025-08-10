"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, MapPin, CalendarIcon, Users, ArrowRight, Play, Plane } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"

export default function HeroSection() {
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    travelers: "2",
    type: "flights",
  })

  const handleSearch = () => {
    console.log("Search data:", searchData)
    // Here you would integrate with your booking API
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden md:mt-14 mt-20">
      {/* Background Video/Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Beautiful tropical destination"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-bounce">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
          <Plane className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="absolute bottom-32 right-16 animate-pulse">
        <div className="bg-secondary-500/20 backdrop-blur-sm rounded-full p-3">
          <MapPin className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
            Your Dream Vacation
            <span className="block bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Starts Here
            </span>
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Discover breathtaking destinations, create unforgettable memories, and embark on the journey of a lifetime
            with our expertly curated travel experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Explore Destinations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-full bg-transparent backdrop-blur-sm"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Video
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-5xl mx-auto animate-fade-in">
          <div className="flex flex-wrap gap-4 mb-4">
            <Button
              variant={searchData.type === "flights" ? "default" : "ghost"}
              onClick={() => setSearchData({ ...searchData, type: "flights" })}
              className="rounded-full"
            >
              ✈️ Flights
            </Button>
            <Button
              variant={searchData.type === "hotels" ? "default" : "ghost"}
              onClick={() => setSearchData({ ...searchData, type: "hotels" })}
              className="rounded-full"
            >
              🏨 Hotels
            </Button>
            <Button
              variant={searchData.type === "tours" ? "default" : "ghost"}
              onClick={() => setSearchData({ ...searchData, type: "tours" })}
              className="rounded-full"
            >
              🗺️ Tours
            </Button>
            <Button
              variant={searchData.type === "packages" ? "default" : "ghost"}
              onClick={() => setSearchData({ ...searchData, type: "packages" })}
              className="rounded-full"
            >
              📦 Packages
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Where do you want to go?"
                  value={searchData.destination}
                  onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                  className="pl-10 h-12 text-gray-900 border-gray-200 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start text-left font-normal text-gray-900 border-gray-200 bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchData.checkIn ? format(searchData.checkIn, "MMM dd") : "Check-in"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={searchData.checkIn}
                    onSelect={(date:any) => setSearchData({ ...searchData, checkIn: date })}
                    disabled={(date:any) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start text-left font-normal text-gray-900 border-gray-200 bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchData.checkOut ? format(searchData.checkOut, "MMM dd") : "Check-out"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  {/* <Calendar
                    mode="single"
                    selected={searchData.checkOut}
                    onSelect={(date) => setSearchData({ ...searchData, checkOut: date })}
                    disabled={(date) => date < new Date() || (searchData.checkIn && date <= searchData.checkIn)}
                    initialFocus
                  /> */}
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Select
                value={searchData.travelers}
                onValueChange={(value:any) => setSearchData({ ...searchData, travelers: value })}
              >
                <SelectTrigger className="h-12 text-gray-900 border-gray-200">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Traveler</SelectItem>
                  <SelectItem value="2">2 Travelers</SelectItem>
                  <SelectItem value="3">3 Travelers</SelectItem>
                  <SelectItem value="4">4 Travelers</SelectItem>
                  <SelectItem value="5+">5+ Travelers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSearch}
            className="w-full mt-4 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-semibold rounded-xl"
          >
            <Search className="mr-2 h-5 w-5" />
            Search Now
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 animate-fade-in">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-400 mb-2">150+</div>
            <div className="text-gray-300">Destinations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary-400 mb-2">50K+</div>
            <div className="text-gray-300">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-400 mb-2">15+</div>
            <div className="text-gray-300">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-secondary-400 mb-2">24/7</div>
            <div className="text-gray-300">Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}
