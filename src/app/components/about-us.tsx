import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Users, Globe, Heart, Shield, Clock } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized as the best travel agency for 3 consecutive years",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Professional travel consultants with 15+ years of experience",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Partnerships with hotels and guides in 150+ destinations",
  },
  {
    icon: Heart,
    title: "Personalized Service",
    description: "Tailored itineraries designed specifically for your preferences",
  },
  {
    icon: Shield,
    title: "Secure Booking",
    description: "100% secure payments and comprehensive travel insurance",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock assistance before, during, and after your trip",
  },
]

export default function AboutUs() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary-100 text-secondary-700 hover:bg-secondary-200">About WanderLust</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Your Trusted Travel
            <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Partner Since 2008
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At WanderLust, we believe that travel is more than just visiting new places—it's about creating
            life-changing experiences, building connections, and discovering the extraordinary in every journey. For
            over 15 years, we've been crafting personalized adventures that exceed expectations.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-heading font-bold text-gray-900">Our Story</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              Founded in 2008 by Alexandra Smith, WanderLust began as a small boutique travel agency with a simple
              mission: to make extraordinary travel accessible to everyone. What started as a passion project has grown
              into a globally recognized travel company.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Today, we've helped over 50,000 travelers explore 150+ destinations worldwide. Our team of expert travel
              consultants brings decades of combined experience, ensuring every trip is meticulously planned and
              flawlessly executed.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">50K+</div>
                <div className="text-gray-600">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600 mb-2">150+</div>
                <div className="text-gray-600">Destinations</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <Image
              src="/placeholder.svg?height=500&width=600"
              alt="WanderLust team"
              width={600}
              height={500}
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
