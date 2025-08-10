"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the email to your backend
    setIsSubscribed(true)
    setEmail("")
  }

  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Mail className="h-16 w-16 text-white mx-auto mb-6" />
        <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about exclusive deals, new destinations, and travel tips.
        </p>

        {isSubscribed ? (
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg inline-block">
            Thank you for subscribing! Check your email for confirmation.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" className="bg-white text-blue-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
