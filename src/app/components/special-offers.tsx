"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Percent,
  Gift,
  Zap,
} from "lucide-react";
import Image from "next/image";

const offers = [
  {
    id: 1,
    title: "Early Bird Special",
    subtitle: "Book 3 months in advance",
    discount: 25,
    description:
      "Save big on your next adventure with our early bird discount. Perfect for planners!",
    image: "/placeholder.svg?height=300&width=500",
    validUntil: "2024-03-31",
    code: "EARLY25",
    type: "percentage",
    icon: Clock,
    color: "from-blue-500 to-purple-600",
  },
  {
    id: 2,
    title: "Summer Flash Sale",
    subtitle: "Limited time offer",
    discount: 40,
    description:
      "Unbeatable prices on tropical destinations. Don't miss out on this flash sale!",
    image: "/placeholder.svg?height=300&width=500",
    validUntil: "2024-02-15",
    code: "FLASH40",
    type: "percentage",
    icon: Zap,
    color: "from-orange-500 to-red-600",
  },
  {
    id: 3,
    title: "Family Package Deal",
    subtitle: "Perfect for families",
    discount: 500,
    description:
      "Special family packages with activities for all ages. Create memories together!",
    image: "/placeholder.svg?height=300&width=500",
    validUntil: "2024-04-30",
    code: "FAMILY500",
    type: "fixed",
    icon: Gift,
    color: "from-green-500 to-teal-600",
  },
  {
    id: 4,
    title: "Luxury Escape",
    subtitle: "Premium experiences",
    discount: 30,
    description:
      "Indulge in luxury with our premium packages at discounted rates.",
    image: "/placeholder.svg?height=300&width=500",
    validUntil: "2024-03-15",
    code: "LUXURY30",
    type: "percentage",
    icon: Percent,
    color: "from-purple-500 to-pink-600",
  },
];

export default function SpecialOffers() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const newTimeLeft: { [key: number]: string } = {};

      offers.forEach((offer) => {
        const endTime = new Date(offer.validUntil).getTime();
        const distance = endTime - now;

        if (distance > 0) {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );

          newTimeLeft[offer.id] = `${days}d ${hours}h ${minutes}m`;
        } else {
          newTimeLeft[offer.id] = "Expired";
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + offers.length) % offers.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-200">
            🔥 Hot Deals
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Special Offers &
            <span className="block bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Limited Deals
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't miss out on these incredible deals! Limited time offers with
            amazing savings on your dream destinations.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {offers.map((offer) => (
                <div key={offer.id} className="w-full flex-shrink-0">
                  <Card className="border-0 shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {/* Image Section */}
                      <div className="relative h-64 lg:h-auto">
                        <Image
                          src={offer.image || "/placeholder.svg"}
                          alt={offer.title}
                          fill
                          className="object-cover"
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${offer.color} opacity-80`}
                        />

                        {/* Floating Discount Badge */}
                        <div className="absolute top-6 left-6">
                          <div className="bg-white rounded-full p-4 shadow-lg">
                            <div className="text-center">
                              <div className="text-3xl font-bold text-gray-900">
                                {offer.type === "percentage"
                                  ? `${offer.discount}%`
                                  : `₹${offer.discount}`}
                              </div>
                              <div className="text-sm text-gray-600">OFF</div>
                            </div>
                          </div>
                        </div>

                        {/* Timer */}
                        <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {timeLeft[offer.id] || "Loading..."}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                        <div className="flex items-center mb-4">
                          <div
                            className={`p-3 rounded-full bg-gradient-to-r ${offer.color} mr-4`}
                          >
                            <offer.icon className="h-6 w-6 text-white" />
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-700"
                          >
                            {offer.subtitle}
                          </Badge>
                        </div>

                        <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                          {offer.title}
                        </h3>

                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                          {offer.description}
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Promo Code:
                            </span>
                            <div className="flex items-center space-x-2">
                              <code className="bg-white px-3 py-1 rounded border text-sm font-mono font-bold text-primary-600">
                                {offer.code}
                              </code>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  navigator.clipboard.writeText(offer.code)
                                }
                              >
                                Copy
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <Button
                            size="lg"
                            className={`bg-gradient-to-r ${offer.color} hover:opacity-90 text-white flex-1`}
                          >
                            Claim Offer
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            className="flex-1 bg-transparent"
                          >
                            Learn More
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                          *Terms and conditions apply. Valid until{" "}
                          {
                            new Date(offer.validUntil)
                              .toISOString()
                              .split("T")[0]
                          }
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
