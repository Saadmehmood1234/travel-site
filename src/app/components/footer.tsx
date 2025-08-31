"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plane,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PaynowButton from "./PaynowButton";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { data: session } = useSession();
  const router = useRouter();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    toast.success("Payment completed successfully!");
  };

  return (
    <footer className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <Link href="/">
                <div className="w-52 bg-white rounded-full">
                  <img src="/logo.png" />
                </div>
              </Link>
            </div>
            <p className="text-gray-100 mb-6 leading-relaxed">
              Your trusted travel partner for unforgettable adventures around
              the world. We create personalized experiences that turn your
              travel dreams into reality.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 p-2 rounded-full hover:bg-primary-600 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/destinations"
                  className="text-gray-100 hover:text-white transition-colors"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="#booking"
                  className="text-gray-100 hover:text-white transition-colors"
                >
                  Book Now
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="text-gray-100 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="#contact"
                  className="text-gray-100 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <PaynowButton onSuccess={handlePaymentSuccess} />
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6">Travel Services</h3>
            <ul className="space-y-3">
              <li>Flight Booking</li>
              <li>Hotel Reservations</li>
              <li>Guided Tours</li>
              <li>Travel Packages</li>
              <li>Visa Assistance</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Connected</h3>
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary-400" />
                <span className="text-gray-100 text-sm">
                  Second Floor, A-245, Devli Rd, opp. Honda Showroom, near
                  Vishal Mega Mart, Khanpur Village, Khanpur, New Delhi, Delhi
                  110062
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-secondary-400" />
                <span className="text-gray-100 text-sm">+91-9310682414</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400" />
                <span className="text-gray-100 text-sm">
                  info@cloudshipholidays.com
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-100 text-sm">
              © {new Date().getFullYear()} Cloudship Holidays. All rights
              reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-100 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-100 hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cancellation-policy"
                className="text-gray-100 hover:text-white transition-colors"
              >
                Cancellation Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
