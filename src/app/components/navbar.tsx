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
  const { data: session } = useSession();
  const navLinks = [
    {
      href: "/",
      label: "Home",

    },
    {
      href: "destinations",
      label: "Destinations",

    },
    {
      href: "destinations",
      label: "Book Now",
    },
    {
      href: "#about",
      label: "About",
    },
    {
      href: "#contact",
      label: "Contact",
    }
  ];
  return (
    <div className="fixed  w-full z-50 flex flex-col gap-3 bg-white pt-5 top-0">
      {/* Top Bar */}
      <div className=" text-sm">
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
        className='bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-2 px-4 text-sm'
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-52">
                <img src="/logo.png" />
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 gap-2">
              {
                navLinks && navLinks?.map((n,i) => (
                  <Link
                  key={i}
                    href={`/${n?.href}`}
                    className="text-white hover:text-gray-200 border-b-2 border-transparent hover:border-white transition-colors font-medium px-3 py-2"
                  >
                    {n?.label}
                  </Link>
                ))
              }


              {!session ? (
                <Link href="/auth/signin">
                  <Button className="bg-blue-600 text-white w-[130px] shadow-lg">
                    Sign In
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
                className="text-white hover:font-bold hover:text-gray-50"
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
                {
                  navLinks && navLinks?.map((n,i) => (
                    <Link
                    key={i}
                      href={`/${n?.href}`}
                      className="text-white hover:font-bold hover:text-gray-50 font-medium"

                    >
                      {n?.label}
                    </Link>
                  ))
                }

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
    </div>
  );
}
