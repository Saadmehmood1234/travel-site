"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, ChevronLeft, ChevronRight, Play } from "lucide-react"
import Image from "next/image"
import { getTestimonials } from "../actions/testimonials.actions"
import { ITestimonial } from "@/model/Testimonial"
import { SectionWrapper } from "@/app/components/ui/section-wrapper"
import { SectionHeader } from "@/app/components/ui/section-header"

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await getTestimonials()
        setTestimonials(data)
      } catch (error) {
        console.error("Failed to fetch testimonials:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  if (loading) {
    return (
      <SectionWrapper background="primary">
        <div className="text-center">
          <h2 className="section-title">
            Loading Testimonials...
          </h2>
        </div>
      </SectionWrapper>
    )
  }

  if (testimonials.length === 0) {
    return (
      <SectionWrapper background="primary">
        <div className="text-center">
          <h2 className="section-title">
            No Testimonials Yet
          </h2>
        </div>
      </SectionWrapper>
    )
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <SectionWrapper background="primary">
      <SectionHeader
        badge="⭐ Customer Reviews"
        title={
          <>
            What Our Travelers
            <span className="block text-primary-600">
              Are Saying
            </span>
          </>
        }
        subtitle="Don't just take our word for it - hear from our satisfied customers who have experienced unforgettable journeys with us."
      />
        <div className="relative max-w-4xl mx-auto mb-12">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={currentTestimonial.image || "/placeholder.svg"}
                    alt={currentTestimonial.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm font-medium text-gray-900">{currentTestimonial.destination}</span>
                  </div>
                  {currentTestimonial.verified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                      ✓ Verified
                    </div>
                  )}
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <Quote className="h-12 w-12 text-primary-200 mb-6" />
                  <div className="flex items-center mb-4">
                    {[...Array(currentTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({currentTestimonial.rating}.0)</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{currentTestimonial.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">"{currentTestimonial.comment}"</p>
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
      </SectionWrapper>
    )
  }