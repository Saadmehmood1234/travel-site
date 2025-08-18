"use client";

import { useState } from "react";
import Image from "next/image";
import {
  LogOut,
  Heart,
  Package,
  User,
  Settings,
  CreditCard,
  Globe,
  Bell,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import SignOutButton from "./SignOutButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) {
    router.push("/auth/signin");
    return;
  }
  const stats = [
    { label: "Trips", value: 12 },
    { label: "Countries", value: 8 },
    { label: "Points", value: 2450 },
  ];

  return (
    <div className="flex justify-center p-4 md:p-8  mt-24">
      <Card className="w-full max-w-4xl shadow-xl rounded-2xl overflow-hidden border-0 bg-white/95 backdrop-blur-sm">
        <div className="relative h-40 bg-gradient-to-r from-primary-500 to-secondary-500">
          <div className="absolute -bottom-16 left-6">
            <Avatar className="h-32 w-32 border-4 border-white">
              <AvatarImage src={session?.user?.image} alt="Profile Picture" />
              <AvatarFallback className="bg-white text-primary-500 text-2xl font-bold">
               
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="mt-20 px-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4 space-y-4">
              <div>
                <h2 className="text-2xl font-bold">{session?.user?.name}</h2>
                <p className="text-gray-500">{session?.user?.email}</p>
              </div>

              <Separator />

              <nav className="space-y-1">
                <Button
                  variant={activeTab === "account" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("account")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
                <Button
                  variant={activeTab === "bookings" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("bookings")}
                >
                  <Package className="h-4 w-4 mr-2" />
                  My Bookings
                </Button>
                <Button
                  variant={activeTab === "wishlist" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
                <Button
                  variant={activeTab === "payments" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("payments")}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payments
                </Button>
              </nav>

              <Separator />
            </div>
            <div className="w-full md:w-3/4">
              {activeTab === "account" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold">Account Overview</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                      <Card key={index} className="text-center p-4">
                        <p className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                          {stat.value}
                        </p>
                        <p className="text-gray-500">{stat.label}</p>
                      </Card>
                    ))}
                  </div>
                  <Card>
                    <CardHeader className="font-semibold">
                      Personal Information
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500">Name</label>
                          <p className="font-medium"> {session?.user?.name}</p>
                        </div>

                        <div>
                          <label className="text-sm text-gray-500">Email</label>
                          <p className="font-medium"> {session?.user?.email}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Phone</label>
                          <p className="font-medium"> {session?.user?.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              {activeTab === "bookings" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Upcoming Trips</h3>
                  <Card className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <Globe className="text-primary-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Bali, Indonesia</h4>
                        <p className="text-sm text-gray-500">
                          June 15-25, 2023 • 2 travelers
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        View Details
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
              {activeTab === "wishlist" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Saved Destinations</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3].map((item) => (
                      <Card key={item} className="group overflow-hidden">
                        <div className="relative h-40">
                          <Image
                            src={`/destination-${item}.jpg`}
                            alt="Destination"
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <Heart className="absolute top-3 right-3 h-6 w-6 text-red-500 fill-red-500" />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-medium">
                            Beautiful Destination {item}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Saved on April {item}, 2023
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <CardFooter className="flex justify-end p-6 border-t">
          <SignOutButton />
        </CardFooter>
      </Card>
    </div>
  );
}
