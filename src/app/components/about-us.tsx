"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Users, Globe, Heart, Shield, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const features = [
  {
    icon: Clock,
    title: "Stress-free Planning",
    description: "Expert planning and attention to detail for seamless travel experiences",
  },
  {
    icon: Heart,
    title: "Unforgettable Experiences",
    description: "Journeys designed to go beyond expectations and create lasting memories",
  },
  {
    icon: Shield,
    title: "24/7 Support",
    description: "Round-the-clock assistance before, during, and after your trip",
  },
  {
    icon: Award,
    title: "Best Value Assurance",
    description: "Direct B2B rates offering unmatched value and transparency",
  },
]

const aboutImages = [
  "/about1.png",
  "/about2.png",
  "/about3.png"
]

export default function AboutUs() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === aboutImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? aboutImages.length - 1 : prevIndex - 1
    );
  };

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary-100 text-secondary-700 hover:bg-secondary-200">About Cloudship Holidays</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Transforming Travel Into
            <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Memorable Experiences
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Founded in 2024, Cloudship Holidays was built to transform travel into a seamless, personalized, and memorable experience. From family vacations to luxury escapes and adventurous getaways, we design journeys that go beyond expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-heading font-bold text-gray-900">Our Vision</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our vision is simple—empower clients across India with direct B2B rates, offering unmatched value, transparency, and trusted service. With expert planning and attention to detail, Cloudship Holidays turns every trip into a story worth telling.
            </p>
            <div className="bg-primary-50 p-6 rounded-xl border-l-4 border-primary-500">
              <h4 className="text-xl font-heading font-bold text-gray-900 mb-3">Our Promise</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✨</span>
                  <span className="text-gray-700">Stress-free Planning</span>
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✨</span>
                  <span className="text-gray-700">Unforgettable Experiences</span>
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✨</span>
                  <span className="text-gray-700">24/7 Support</span>
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✨</span>
                  <span className="text-gray-700">Best Value Assurance</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative h-[500px] overflow-hidden rounded-2xl shadow-2xl">
              {aboutImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Cloudship Holidays ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-10 w-10"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-10 w-10"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {aboutImages.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">2024</div>
                <div className="text-sm text-gray-600">Founded</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}