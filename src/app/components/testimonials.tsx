"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, ChevronLeft, ChevronRight, Play } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    title: "Absolutely Amazing Experience!",
    comment:
      "WanderLust made our honeymoon in Bali absolutely perfect. Every detail was taken care of, from the airport pickup to the romantic dinner on the beach. The local guides were incredibly knowledgeable and friendly. We couldn't have asked for a better experience!",
    image: "/placeholder.svg?height=100&width=100",
    destination: "Bali, Indonesia",
    date: "December 2023",
    verified: true,
    video: "/placeholder.mp4",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Toronto, Canada",
    rating: 5,
    title: "Swiss Alps Adventure of a Lifetime",
    comment:
      "The Swiss Alps adventure exceeded all expectations. The accommodations were luxurious, the views were breathtaking, and the skiing was world-class. Our guide Marco was fantastic and showed us hidden gems that most tourists never see. Already planning our next trip with WanderLust!",
    image: "/placeholder.svg?height=100&width=100",
    destination: "Switzerland",
    date: "January 2024",
    verified: true,
    video: null,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "Madrid, Spain",
    rating: 5,
    title: "Perfect Family Vacation",
    comment:
      "Our family trip to Japan was seamlessly organized. The cultural experiences and food tours were highlights of our vacation. The kids loved the theme parks, and we adults enjoyed the traditional temples and gardens. WanderLust thought of everything, even dietary restrictions!",
    image: "/placeholder.svg?height=100&width=100",
    destination: "Tokyo, Japan",
    date: "March 2024",
    verified: true,
    video: null,
  },
  {
    id: 4,
    name: "David Thompson",
    location: "London, UK",
    rating: 5,
    title: "Safari Dreams Come True",
    comment:
      "The African safari was beyond our wildest dreams. Seeing the Big Five in their natural habitat was incredible. Our guide was extremely knowledgeable about wildlife and conservation. The luxury tented camp was comfortable and the food was excellent. Highly recommend!",
    image: "/placeholder.svg?height=100&width=100",
    destination: "Kenya & Tanzania",
    date: "February 2024",
    verified: true,
    video: "/placeholder.mp4",
  },
  {
    id: 5,
    name: "Lisa Wang",
    location: "Singapore",
    rating: 5,
    title: "Maldives Paradise",
    comment:
      "The overwater villa in Maldives was pure luxury. Crystal clear waters, amazing snorkeling, and the most beautiful sunsets I've ever seen. The spa treatments were divine and the staff went above and beyond to make our stay special. Worth every penny!",
    image: "/placeholder.svg?height=100&width=100",
    destination: "Maldives",
    date: "November 2023",
    verified: true,
    video: null,
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">⭐ Customer Reviews</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            What Our Travelers
            <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Are Saying
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers who have experienced unforgettable
            journeys with us.
          </p>
        </div>

        {/* Main Testimonial */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image/Video Section */}
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={currentTestimonial.image || "/placeholder.svg"}
                    alt={currentTestimonial.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Video Play Button */}
                  {currentTestimonial.video && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 group-hover:bg-white transition-all duration-300 group-hover:scale-110">
                        <Play className="h-8 w-8 text-primary-600 ml-1" />
                      </div>
                    </button>
                  )}

                  {/* Destination Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-900">{currentTestimonial.destination}</span>
                  </div>

                  {/* Verified Badge */}
                  {currentTestimonial.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      ✓ Verified
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  {/* Quote Icon */}
                  <Quote className="h-12 w-12 text-primary-200 mb-6" />

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({currentTestimonial.rating}.0)</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentTestimonial.title}</h3>

                  {/* Comment */}
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">"{currentTestimonial.comment}"</p>

                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{currentTestimonial.name}</h4>
                      <p className="text-gray-600">{currentTestimonial.location}</p>
                      <p className="text-sm text-gray-500">{currentTestimonial.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  )
}
