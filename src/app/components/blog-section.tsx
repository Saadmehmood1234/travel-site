import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowRight, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "10 Best Hidden Beaches in Bali You Must Visit",
    excerpt:
      "Discover the secret beaches of Bali that most tourists never find. From pristine white sands to crystal-clear waters, these hidden gems offer the perfect escape from crowded tourist spots.",
    image: "/placeholder.svg?height=300&width=500",
    author: "Sarah Johnson",
    date: "March 15, 2024",
    readTime: "8 min read",
    category: "Beach Destinations",
    featured: true,
  },
  {
    id: 2,
    title: "Ultimate Guide to Swiss Alps: Best Time to Visit",
    excerpt:
      "Planning a trip to the Swiss Alps? Learn about the best seasons for skiing, hiking, and sightseeing. Get insider tips on weather, accommodation, and must-see attractions.",
    image: "/placeholder.svg?height=300&width=500",
    author: "Marcus Johnson",
    date: "March 12, 2024",
    readTime: "12 min read",
    category: "Adventure Travel",
    featured: false,
  },
  {
    id: 3,
    title: "Tokyo Food Tour: A Culinary Journey Through Japan",
    excerpt:
      "Explore Tokyo's incredible food scene from street food to Michelin-starred restaurants. Discover the best neighborhoods for authentic Japanese cuisine and hidden local favorites.",
    image: "/placeholder.svg?height=300&width=500",
    author: "Sofia Rodriguez",
    date: "March 10, 2024",
    readTime: "10 min read",
    category: "Food & Culture",
    featured: true,
  },
  {
    id: 4,
    title: "Safari Photography Tips: Capturing Wildlife in Africa",
    excerpt:
      "Master the art of wildlife photography on your African safari. Learn about camera settings, best times for shooting, and ethical wildlife photography practices.",
    image: "/placeholder.svg?height=300&width=500",
    author: "David Kim",
    date: "March 8, 2024",
    readTime: "15 min read",
    category: "Photography",
    featured: false,
  },
  {
    id: 5,
    title: "Luxury Travel: Maldives Resort Guide 2024",
    excerpt:
      "Compare the best luxury resorts in the Maldives. From overwater villas to world-class spas, find the perfect resort for your romantic getaway or family vacation.",
    image: "/placeholder.svg?height=300&width=500",
    author: "Alexandra Smith",
    date: "March 5, 2024",
    readTime: "11 min read",
    category: "Luxury Travel",
    featured: false,
  },
  {
    id: 6,
    title: "Budget Travel: Exploring Europe on $50 a Day",
    excerpt:
      "Discover how to travel through Europe without breaking the bank. Tips on budget accommodation, cheap eats, free attractions, and money-saving transportation options.",
    image: "/placeholder.svg?height=300&width=500",
    author: "Emma Rodriguez",
    date: "March 3, 2024",
    readTime: "9 min read",
    category: "Budget Travel",
    featured: false,
  },
]

const categories = [
  "All",
  "Beach Destinations",
  "Adventure Travel",
  "Food & Culture",
  "Photography",
  "Luxury Travel",
  "Budget Travel",
]

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">📖 Travel Blog</Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Travel Guides &
            <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Expert Tips
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get inspired with our comprehensive travel guides, insider tips, and destination insights from our team of
            travel experts and experienced adventurers.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="overflow-hidden border-0 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <Image
                  src={blogPosts[0].image || "/placeholder.svg"}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 text-white">Featured</Badge>
                </div>
              </div>
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-4">
                  {blogPosts[0].category}
                </Badge>
                <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                  {blogPosts[0].title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">{blogPosts[0].excerpt}</p>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span className="text-sm">{blogPosts[0].author}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{blogPosts[0].date}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{blogPosts[0].readTime}</span>
                    </div>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-fit bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                >
                  <Link href={`/blog/${blogPosts[0].id}`}>
                    Read Full Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.slice(1).map((post) => (
            <Card
              key={post.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-0 shadow-lg hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-3">
                  {post.category}
                </Badge>
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-primary-600 transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <Button asChild size="sm" variant="ghost" className="text-primary-600 hover:text-primary-700">
                    <Link href={`/blog/${post.id}`}>
                      Read More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-heading font-bold mb-4">Stay Updated with Travel Tips</h3>
          <p className="text-primary-100 mb-6">
            Subscribe to our newsletter and get the latest travel guides, tips, and exclusive deals delivered to your
            inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-primary-600 hover:bg-gray-100 px-6">Subscribe</Button>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white px-8 bg-transparent"
          >
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
