"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Plane, Phone, Mail } from "lucide-react";
import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";
import { Profile } from "./Profile";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();
  console.log(session);
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
              <span>+91-9310682414</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>info@cloudshipholidays.com</span>
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
              <div className="w-52">
                <img src="/logo.png" />
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
              {!session ? (
                <Link href="/auth/signin">
                  <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white">
                    Login
                  </Button>
                </Link>
              ) : (
                <Link href="/profile">
                  <Image
                    src={session?.user?.image || "/default-avatar.png"}
                    alt="Profile Picture"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </Link>
              )}
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
                {!session ? (
                  <Link href="/auth/signin">
                    <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white">
                      Login
                    </Button>
                  </Link>
                ) : (
                  <Link href="/profile">
                    <div className="flex gap-2 justify-start items-center">
                      <Button>Profile</Button>
                      <SignOutButton />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
