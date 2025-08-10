"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Plane, Phone, Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
const { data: session } = useSession();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-600 text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-1" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>info@wanderlust.com</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>🌟 Special Offer: 20% off all bookings this month!</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg py-2"
            : "bg-white/95 backdrop-blur-sm py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-xl">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-heading font-bold text-gray-900">
                  WanderLust
                </span>
                <p className="text-xs text-gray-600">Travel Agency</p>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="#destinations"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Destinations
              </Link>
              <Link
                href="#booking"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Book Now
              </Link>
              <Link
                href="#about"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                About
              </Link>
              <Link
                href="#blog"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Blog
              </Link>
              <Link
                href="#contact"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                Contact
              </Link>
             <Link href="/auth/signin">
             {!session?(
               <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white">
                Login
              </Button>
             ):(
              <SignOutButton/>
             )}
             </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 hover:text-primary-600"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <div className="flex flex-col space-y-4 pt-4">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  Home
                </Link>
                <Link
                  href="#destinations"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  Destinations
                </Link>
                <Link
                  href="#booking"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  Book Now
                </Link>
                <Link
                  href="#about"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  About
                </Link>
                <Link
                  href="#blog"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  Blog
                </Link>
                <Link
                  href="#contact"
                  className="text-gray-700 hover:text-primary-600 font-medium"
                >
                  Contact
                </Link>
                <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white w-full">
                  Get Quote
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
