"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Plane, Phone, Mail, ChevronDown, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import SignOutButton from "./SignOutButton";
import { Profile } from "./Profile";
import { getProducts } from "../actions/product.actions";

interface Trip {
  id: string;
  title: string;
  subtitle: string;
  category?: string;
}

interface DestinationCategory {
  category: string;
  items: { name: string; href: string }[];
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const [isMobileDestinationsOpen, setIsMobileDestinationsOpen] = useState(false);
  const { data: session } = useSession();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      href: "flights",
      label: "Flight",
    },
    {
      href: "#about",
      label: "About",
    },
    {
      href: "#contact",
      label: "Contact",
    },
  ];

  useEffect(() => {
    async function fetchTrips() {
      try {
        setLoading(true);
        setError(null);
        const result = await getProducts();

        if (result.success && result.data) {
          const tripsData = result.data.map((product) => ({
            id: product._id,
            title: product.name,
            subtitle: product.location,
            category: product.category || "Domestic",
          }));
          setTrips(tripsData);
        } else {
          setError("Failed to load products");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  const categorizeTrips = (trips: Trip[]): DestinationCategory[] => {
    const categories: { [key: string]: Trip[] } = {};
    
    trips.forEach(trip => {
      const category = trip.category || "Domestic";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(trip);
    });

    return Object.entries(categories).map(([category, items]) => ({
      category,
      items: items.slice(0, 6).map(item => ({
        name: item.title,
        href: `/destinations/${item.id}`
      }))
    }));
  };

  const getDestinationMenu = (): DestinationCategory[] => {
    const apiCategories = categorizeTrips(trips);
    
    if (apiCategories.length > 0) {
      return apiCategories;
    }

    return [
      {
        category: "Popular Destinations",
        items: [
          { name: "Manali", href: "/destinations/manali" },
          { name: "Goa", href: "/destinations/goa" },
          { name: "Kerala", href: "/destinations/kerala" },
          { name: "Rajasthan", href: "/destinations/rajasthan" },
        ],
      },
      {
        category: "International",
        items: [
          { name: "Thailand", href: "/destinations/thailand" },
          { name: "Bali, Indonesia", href: "/destinations/bali" },
          { name: "Dubai, UAE", href: "/destinations/dubai" },
          { name: "Singapore", href: "/destinations/singapore" },
          { name: "Maldives", href: "/destinations/maldives" },
        ],
      },
      {
        category: "Domestic",
        items: [
          { name: "Shimla", href: "/destinations/shimla" },
          { name: "Darjeeling", href: "/destinations/darjeeling" },
          { name: "Varanasi", href: "/destinations/varanasi" },
          { name: "Mumbai", href: "/destinations/mumbai" },
          { name: "Andaman Islands", href: "/destinations/andaman" },
        ],
      },
    ];
  };

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

  const destinationMenu = getDestinationMenu();

  return (
    <div className="fixed w-full z-50 flex flex-col gap-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white pt-5 top-0">
      <div className="text-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center px-2 space-x-4">
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
      <nav className="bg-white text-gray-900 py-2 px-4 text-sm border border-gray-600">
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
                      className="text-gray-800 hover:text-gray-600 border-b-2 border-transparent hover:border-black transition-colors font-medium px-3 py-2 flex items-center gap-1"
                    >
                      {n.label}
                      <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                    </button>
                  ) : (
                    <Link
                      href={`/${n.href}`}
                      className="text-gray-800 hover:text-gray-600 border-b-2 border-transparent hover:border-black transition-colors font-medium px-3 py-2"
                    >
                      {n.label}
                    </Link>
                  )}

                  {n.hasMenu && isDestinationsOpen && (
                    <div
                      className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 p-6"
                      onMouseEnter={() => setIsDestinationsOpen(true)}
                      onMouseLeave={() => setIsDestinationsOpen(false)}
                    >
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading destinations...</p>
                        </div>
                      ) : error ? (
                        <div className="text-center py-8">
                          <p className="text-red-500 mb-2">Failed to load destinations</p>
                          <p className="text-gray-600 text-sm">Showing sample destinations</p>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-3 gap-6">
                            {destinationMenu.map((section, index) => (
                              <div key={index}>
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                                  {section.category}
                                </h3>
                                <ul className="space-y-2">
                                  {section.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                      <Link
                                        href={item.href}
                                        className="text-gray-600 hover:text-primary-600 transition-colors text-sm block py-1"
                                        onClick={() => setIsDestinationsOpen(false)}
                                      >
                                        {item.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <Link
                              href="/destinations"
                              className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                              onClick={() => setIsDestinationsOpen(false)}
                            >
                              View All Destinations →
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {!session ? (
                <Link href="/auth/signin">
                  <Button
                    className="flex items-center gap-2 px-2 py-2 rounded-sm font-semibold text-white
                 bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 
                 hover:opacity-90 transition-all
                 backdrop-blur-md border border-white/20"
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

          {isOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <div className="flex flex-col space-y-4 pt-4">
                {navLinks.map((n, i) => (
                  <div key={i}>
                    {n.hasMenu ? (
                      <div className="flex flex-col">
                        <button
                          onClick={() => setIsMobileDestinationsOpen(!isMobileDestinationsOpen)}
                          className="text-white hover:font-bold hover:text-gray-50 font-medium flex items-center justify-between w-full py-2"
                        >
                          <span>{n.label}</span>
                          <ChevronRight className={`h-4 w-4 transition-transform ${isMobileDestinationsOpen ? 'rotate-90' : ''}`} />
                        </button>
                        
                        {isMobileDestinationsOpen && (
                          <div className="pl-4 mt-2 space-y-3 border-l border-white/20 ml-2">
                            {loading ? (
                              <div className="text-white/70 text-sm">Loading destinations...</div>
                            ) : error ? (
                              <div className="text-white/70 text-sm">Failed to load destinations</div>
                            ) : (
                              <>
                                {destinationMenu.map((section, sectionIndex) => (
                                  <div key={sectionIndex} className="space-y-2">
                                    <h4 className="text-white/80 font-medium text-sm">
                                      {section.category}
                                    </h4>
                                    <div className="space-y-1 pl-2">
                                      {section.items.map((item, itemIndex) => (
                                        <Link
                                          key={itemIndex}
                                          href={item.href}
                                          className="text-white/70 hover:text-white text-sm block py-1"
                                          onClick={() => {
                                            setIsOpen(false);
                                            setIsMobileDestinationsOpen(false);
                                          }}
                                        >
                                          {item.name}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                                <Link
                                  href="/destinations"
                                  className="text-white hover:text-white font-medium text-sm flex items-center pt-2"
                                  onClick={() => {
                                    setIsOpen(false);
                                    setIsMobileDestinationsOpen(false);
                                  }}
                                >
                                  View All Destinations →
                                </Link>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={`/${n.href}`}
                        className="text-white hover:font-bold hover:text-gray-50 font-medium block py-2"
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