"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, USA",
    rating: 5,
    title: "Absolutely Amazing Experience!",
    comment:
      "WanderLust made our honeymoon in Bali absolutely perfect. Every detail was taken care of, from the airport pickup to the romantic dinner on the beach. The local guides were incredibly knowledgeable and friendly. We couldn't have asked for a better experience!",
    image:
      "https://pixabay.com/get/gee42d4b0446afc77e05ac16740bb3b7efb55302f194a6bb03cdad7f0b94d707592fdc3da860d2323a26ad7c12bae8990c3da9826079eceef176189428d421966_640.jpg",
    destination: "Bali, Indonesia",
    date: "December 2023",
    verified: true,
    video: "/placeholder.mp4",
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Toronto, Canada",
    rating: 5,
    title: "Swiss Alps Adventure of a Lifetime",
    comment:
      "The Swiss Alps adventure exceeded all expectations. The accommodations were luxurious, the views were breathtaking, and the skiing was world-class. Our guide Marco was fantastic and showed us hidden gems that most tourists never see. Already planning our next trip with WanderLust!",
    image:
      "https://pixabay.com/get/g6a88bd905720342c8209f3cbe569d765b61cd5773abe2cb6ff64b61904628bdf2993ecad0405e1df54bafa093ca84878276de0d11d69de82bf00759a3080574e_640.jpg",
    destination: "Switzerland",
    date: "January 2024",
    verified: true,
    video: null,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    location: "Madrid, Spain",
    rating: 5,
    title: "Perfect Family Vacation",
    comment:
      "Our family trip to Japan was seamlessly organized. The cultural experiences and food tours were highlights of our vacation. The kids loved the theme parks, and we adults enjoyed the traditional temples and gardens. WanderLust thought of everything, even dietary restrictions!",
    image:
      "https://pixabay.com/get/g49729e4f40a09d9973984caa763499551ea373587d28c1f27587b52dc9d708d0d6fa4a2406cd6634c126e0ea4ae1802e_640.jpg",
    destination: "Tokyo, Japan",
    date: "March 2024",
    verified: true,
    video: null,
  },
  {
    id: 4,
    name: "David Thompson",
    location: "London, UK",
    rating: 5,
    title: "Safari Dreams Come True",
    comment:
      "The African safari was beyond our wildest dreams. Seeing the Big Five in their natural habitat was incredible. Our guide was extremely knowledgeable about wildlife and conservation. The luxury tented camp was comfortable and the food was excellent. Highly recommend!",
    image:
      "https://pixabay.com/get/g5026ec25859217f2919f210f8b633808eeddd56dfd73d8e872155451a17fc04482617a62406ff61403780fb6f66137b2_640.jpg",
    destination: "Kenya & Tanzania",
    date: "February 2024",
    verified: true,
    video: "/placeholder.mp4",
  },
  {
    id: 5,
    name: "Lisa Wang",
    location: "Singapore",
    rating: 5,
    title: "Maldives Paradise",
    comment:
      "The overwater villa in Maldives was pure luxury. Crystal clear waters, amazing snorkeling, and the most beautiful sunsets I've ever seen. The spa treatments were divine and the staff went above and beyond to make our stay special. Worth every penny!",
    image:
      "https://pixabay.com/get/g224f6445650c8e07f1984e07bd3814aa13de9f294eb7a341bc94a0df074656d0137862c9da985d7186353b58c2d7a4994c877eff0c92590a4db017fe2f5ec708_640.jpg",
    destination: "Maldives",
    date: "November 2023",
    verified: true,
    video: null,
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
     <div className="w-full flex justify-center p-4">
      <iframe
         src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.912462906373!2d77.2325879!3d28.512281299999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce1a0ee38a96f%3A0x8ffc64f0186e48b5!2sCloudship%20Holidays!5e0!3m2!1sen!2sin!4v1756641288915!5m2!1sen!2sin"
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
