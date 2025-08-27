
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
  Star,
  Heart,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { getOffers, SerializedOffer } from "@/app/actions/offer.actions";

const iconComponents = {
  Clock,
  Percent,
  Gift,
  Zap,
  Star,
  Heart,
  Tag,
};

export default function SpecialOffers() {
  const [offers, setOffers] = useState<SerializedOffer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true);
        const result = await getOffers();

        if (result.success && result.data) {
          setOffers(result.data);
        } else {
          setError(result.error || "Failed to load offers");
        }
      } catch (err) {

        setError("An error occurred while fetching offers");
      } finally {
        setLoading(false);
      }
    }

    fetchOffers();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const newTimeLeft: { [key: string]: string } = {};

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

          newTimeLeft[offer._id] = `${days}d ${hours}h ${minutes}m`;
        } else {
          newTimeLeft[offer._id] = "Expired";
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [offers]);

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

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              Loading amazing deals...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse bg-gray-200 rounded-2xl w-full h-96"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </section>
    );
  }

  if (offers.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-4">
            No Current Offers
          </h2>

          <p className="text-lg text-gray-600 mb-6">
            Check back later for amazing deals and special offers!
          </p>

          <Button asChild className="bg-gradient-to-r from-primary-500 to-secondary-500">
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {offers.map((offer) => {
                const IconComponent =
                  iconComponents[offer.icon as keyof typeof iconComponents] ||
                  Clock;

                return (
                  <div key={offer._id} className="w-full flex-shrink-0">
                    <Card className="border-0 shadow-2xl overflow-hidden">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
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
                          <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                {timeLeft[offer._id] || "Loading..."}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                          <div className="flex items-center mb-4">
                            <div
                              className={`p-3 rounded-full bg-gradient-to-r ${offer.color} mr-4`}
                            >
                              <IconComponent className="h-6 w-6 text-white" />
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
                              className={`py-2 bg-gradient-to-r ${offer.color} hover:opacity-90 text-white flex-1`}
                            >
                              Claim Offer
                            </Button>
                            <Button
                              size="lg"
                              variant="outline"
                              className="flex-1 py-2 bg-transparent"
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
                );
              })}
            </div>
          </div>
          {offers.length > 1 && (
            <>
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
            </>
          )}
          {offers.length > 1 && (
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
          )}
        </div>
      </div>
    </section>
  );
}
