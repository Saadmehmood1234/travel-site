import { Card, CardContent } from "@/components/ui/card"
import { Plane, Shield, Headphones, MapPin, Camera, Utensils } from "lucide-react"

const services = [
  {
    icon: Plane,
    title: "Flight Booking",
    description: "Find and book the best flights at competitive prices with our extensive airline partnerships.",
  },
  {
    icon: Shield,
    title: "Travel Insurance",
    description: "Comprehensive travel insurance to protect you and your loved ones during your journey.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer support to assist you before, during, and after your trip.",
  },
  {
    icon: MapPin,
    title: "Local Guides",
    description: "Expert local guides who know the hidden gems and best experiences in each destination.",
  },
  {
    icon: Camera,
    title: "Photo Tours",
    description: "Capture stunning memories with our professional photography tours and workshops.",
  },
  {
    icon: Utensils,
    title: "Culinary Experiences",
    description: "Taste authentic local cuisine with our curated food tours and cooking classes.",
  },
]

export default function Services() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive travel services to make your journey seamless and unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <service.icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
