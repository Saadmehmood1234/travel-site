"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Clock, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import {
  addSubscriber
} from "../actions/subscribe.actions";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getBlogBySlug, getBlogs } from "../actions/blog.actions";
import { IBlog } from "@/model/Blog";

export default function BlogSection() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [addState, addAction, isPending] = useActionState(addSubscriber, {
    success: false,
    message: "",
  });

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const blogData = await getBlogs();
        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBlogs();
  }, []);

console.log()
  if (isLoading) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              Loading Blogs...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section id="blog" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              No Blogs Yet
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Check back later for new blog posts.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const featuredBlog = blogs.find(blog => blog.featured) || blogs[0];

  return (
    <section id="blog" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary-100 text-primary-700 hover:bg-primary-200">
            📖 Travel Blog
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Travel Guides &
            <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Expert Tips
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get inspired with our comprehensive travel guides, insider tips, and
            destination insights from our team of travel experts and experienced
            adventurers.
          </p>
        </div>
        
        {featuredBlog && (
          <div className="mb-16">
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={featuredBlog.image || "/placeholder.svg"}
                    alt={featuredBlog.title}
                    fill
                    className="object-cover"
                  />
                  {featuredBlog.featured && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white">Featured</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-4">
                    {featuredBlog.category}
                  </Badge>
                  <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                    {featuredBlog.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    {featuredBlog.excerpt}
                  </p>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span className="text-sm">{featuredBlog.author}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {new Date(featuredBlog.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{featuredBlog.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="w-fit bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
                  >
                    <Link href={`/blog/${featuredBlog.slug}`}>
                      Read Full Article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.filter(blog => blog._id.toString() !== featuredBlog?._id.toString()).map((post) => (
            <Card
              key={post._id.toString()} // Convert ObjectId to string
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
                <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
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
                  <span className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <Button
                    asChild
                    size="sm"
                    variant="ghost"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-heading font-bold mb-4">
            Stay Updated with Travel Tips
          </h3>
          <p className="text-primary-100 mb-6">
            Subscribe to our newsletter and get the latest travel guides, tips,
            and exclusive deals delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <form action={addAction} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  required
                  className="flex-1 text-black"
                  disabled={isPending}
                />

                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-white text-primary-600 hover:bg-gray-100 px-6"
                >
                  {isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
              {addState.message && (
                <p
                  className={`text-sm ${
                    addState.success ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {addState.message}
                </p>
              )}
            </form>
          </div>
        </div>
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
        </div> */}
      </div>
    </section>
  );
}