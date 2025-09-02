"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Plane,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";
import { getProducts } from "../actions/product.actions";

interface Trip {
  id: string;
  title: string;
  subtitle: string;
  tripType: "International" | "Domestic";
  category?: string;
}

interface DestinationCategory {
  category: string;
  items: { name: string; href: string }[];
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const [isMobileDestinationsOpen, setIsMobileDestinationsOpen] =
    useState(false);
  const { data: session } = useSession();
  const destinationsRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "#",
      label: "Destinations",
      hasMenu: true,
    },
    {
      href: "blogs",
      label: "Blogs",
    },
    {
      href: "#about",
      label: "About",
    },
    {
      href: "contact",
      label: "Contact",
    },
  ];

  const staticDestinationMenu: DestinationCategory[] = [
    {
      category: "Domestic",
      items: [
        { name: "Kerala", href: "/packages/kerala" },
        { name: "Himachal", href: "/packages/himachal" },
        { name: "Sikkim-Darjeeling", href: "/packages/sikkim-darjeeling" },
        { name: "Kashmir", href: "/packages/kashmir" },
        { name: "Goa", href: "/packages/goa" },
        { name: "Ladakh", href: "/packages/ladakh" },
        { name: "Rajasthan", href: "/packages/rajasthan" },
        { name: "Andaman", href: "/packages/andaman" },
        { name: "Uttarakhand", href: "/packages/uttarakhand" },
        { name: "North East", href: "/packages/north-east" },
      ],
    },
    {
      category: "International",
      items: [
        { name: "Bali", href: "/packages/bali" },
        { name: "Singapore", href: "/packages/singapore" },
        { name: "Thailand", href: "/packages/thailand" },
        { name: "Dubai", href: "/packages/dubai" },
        { name: "Malaysia", href: "/packages/malaysia" },
        { name: "Maldives", href: "/packages/maldives" },
        { name: "Mauritius", href: "/packages/mauritius" },
        { name: "Vietnam", href: "/packages/vietnam" },
        { name: "Sri Lanka", href: "/packages/sri-lanka" },
        { name: "Turkey", href: "/packages/turkey" },
        { name: "Azerbaijan", href: "/packages/azerbaijan" },
        { name: "Georgia", href: "/packages/georgia" },
        { name: "Hong Kong", href: "/packages/hong-kong" },
        { name: "Kazakhstan", href: "/packages/kazakhstan" },
      ],
    },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        destinationsRef.current &&
        !destinationsRef.current.contains(event.target as Node)
      ) {
        setIsDestinationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed w-full z-50 flex flex-col gap-0 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 text-white pt-4 top-0 shadow-lg">
      <div className="text-sm bg-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center container-padding py-2">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-primary-200" />
              <span className="text-primary-100 hover:text-white transition-colors">+91-9310682414</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-primary-200" />
              <span className="text-primary-100 hover:text-white transition-colors">info@cloudshipholidays.com</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">🌟 Special Offer: 20% off all bookings this month!</span>
          </div>
        </div>
      </div>
      <nav className="bg-white/95 backdrop-blur-md text-gray-900 py-4 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-52">
                <img src="/logo.png" />
              </div>
            </Link>
            <div className="hidden md:flex items-center space-x-8 gap-2">
              {navLinks.map((n, i) => (
                <div
                  key={i}
                  className="relative group"
                  ref={n.hasMenu ? destinationsRef : undefined}
                >
                  {n.hasMenu ? (
                    <button
                      onMouseEnter={() => setIsDestinationsOpen(true)}
                      onMouseLeave={() => setIsDestinationsOpen(false)}
                      className="text-gray-800 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-primary-50 flex items-center gap-2"
                    >
                      {n.label}
                      <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    </button>
                  ) : (
                    <Link
                      href={`/${n.href}`}
                      className="text-gray-800 hover:text-primary-600 border-b-2 border-transparent hover:border-primary-500 transition-all duration-300 font-medium px-4 py-2 rounded-lg hover:bg-primary-50"
                    >
                      {n.label}
                    </Link>
                  )}

                  {n.hasMenu && isDestinationsOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 w-[700px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 p-8"
                      onMouseEnter={() => setIsDestinationsOpen(true)}
                      onMouseLeave={() => setIsDestinationsOpen(false)}
                    >
                      <div className="grid grid-cols-2 gap-8">
                        {staticDestinationMenu.map((section, index) => (
                          <div key={index}>
                            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                              {section.category}
                            </h3>
                            <ul className="space-y-2">
                              {section.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <Link
                                    href={item.href}
                                    className="text-gray-600 hover:text-primary-600 transition-colors text-sm block py-1"
                                    onClick={() =>
                                      setIsDestinationsOpen(false)
                                    }
                                  >
                                    {item.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {!session ? (
                <Link href="/auth/signin">
                  <Button
                    className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold"
                  >
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
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:font-bold hover:text-black0"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <div className="flex flex-col space-y-4 pt-4">
                {navLinks.map((n, i) => (
                  <div key={i}>
                    {n.hasMenu ? (
                      <div className="flex flex-col">
                        <button
                          onClick={() =>
                            setIsMobileDestinationsOpen(
                              !isMobileDestinationsOpen
                            )
                          }
                          className="text-gray-800 hover:font-bold hover:text-gray-600 font-medium flex items-center justify-between w-full py-2"
                        >
                          <span>{n.label}</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-transform ${
                              isMobileDestinationsOpen ? "rotate-90" : ""
                            }`}
                          />
                        </button>

                        {isMobileDestinationsOpen && (
                          <div className="pl-4 mt-2 space-y-4 border-l border-gray-200 ml-2">
                            {staticDestinationMenu.map(
                              (section, sectionIndex) => (
                                <div
                                  key={sectionIndex}
                                  className="space-y-2"
                                >
                                  <h4 className="text-gray-800 font-medium text-sm border-b border-gray-200 pb-1">
                                    {section.category}
                                  </h4>
                                  <div className="space-y-1 pl-2">
                                    {section.items.map(
                                      (item, itemIndex) => (
                                        <Link
                                          key={itemIndex}
                                          href={item.href}
                                          className="text-gray-600 hover:text-primary-600 text-sm block py-1"
                                          onClick={() => {
                                            setIsOpen(false);
                                            setIsMobileDestinationsOpen(
                                              false
                                            );
                                          }}
                                        >
                                          {item.name}
                                        </Link>
                                      )
                                    )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={`/${n.href}`}
                        className="text-gray-800 hover:font-bold hover:text-black font-medium block py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        {n.label}
                      </Link>
                    )}
                  </div>
                ))}

                {!session ? (
                  <Link href="/auth/signin">
                    <Button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white w-full">
                      Login
                    </Button>
                  </Link>
                ) : (
                  <Link href="/profile">
                    <div className="flex gap-2 justify-start items-center">
                      <Button
                        className="flex items-center gap-2 px-2 py-2 rounded-sm font-semibold text-white
                 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 
                 hover:opacity-90 transition-all
                 backdrop-blur-md border border-white/20"
                      >
                        Profile
                      </Button>
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