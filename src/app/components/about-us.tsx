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

const team = [
  {
    name: "Alexandra Smith",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=300&width=300",
    bio: "15+ years in luxury travel with a passion for creating unforgettable experiences.",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Operations",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Expert in logistics and ensuring seamless travel experiences worldwide.",
  },
  {
    name: "Sofia Rodriguez",
    role: "Senior Travel Consultant",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Specialist in European and Mediterranean destinations with local expertise.",
  },
  {
    name: "David Kim",
    role: "Adventure Travel Expert",
    image: "/placeholder.svg?height=300&width=300",
    bio: "Adventure enthusiast specializing in extreme sports and wilderness expeditions.",
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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mb-6 group-hover:from-primary-500 group-hover:to-secondary-500 transition-all duration-300">
                  <feature.icon className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4">Meet Our Expert Team</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our passionate team of travel experts is dedicated to making your dream vacation a reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-6 text-center">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-heading font-bold mb-4">Ready to Start Your Adventure?</h3>
          <p className="text-xl mb-8 text-primary-100">
            Let our expert team create a personalized travel experience just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 px-8">
              Get Free Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary-600 px-8 bg-transparent"
            >
              View Our Packages
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
