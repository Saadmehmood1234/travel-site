"use client";

import { useState, useEffect } from "react";
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
import {
  getWishlistCount,
  getWishlistWithProducts,
} from "../actions/wishlist.actions.ts";
import { getOrdersByUser } from "../actions/order.actions";
import { OrderCreateInput } from "@/types";

interface WishlistItem {
  productId: {
    _id: string;
    name: string;
    image: string;
    location: string;
  };
  addedAt: string;
}

interface WishlistData {
  items: WishlistItem[];
  count: number;
}
interface OrderTrip {
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId: string;
  trips: OrderTrip[];
  totalAmount: number;
  status: string;
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  orders: Order[];
  totalPages: number;
  currentPage: number;
  error?: string;
  success?: boolean;
  message?: string;
}
export function Profile() {
  const [activeTab, setActiveTab] = useState("account");
  const [wishlistData, setWishlistData] = useState<WishlistData | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session?.user?.id) {
      fetchWishlistCount();
    }
  }, [session]);

  useEffect(() => {
    if (activeTab === "wishlist" && session?.user?.id) {
      fetchWishlistData();
    }
  }, [activeTab, session]);

  const fetchWishlistCount = async () => {
    try {
      const result = await getWishlistCount();
      if (result.success) {
        setWishlistCount(result.count || 0);
      }
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };

  const fetchWishlistData = async () => {
    setLoading(true);
    try {
      const result = await getWishlistWithProducts();
      if (result.success && result.data) {
        setWishlistData(result.data);
      }
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchUserOrder = async () => {
      if (!session?.user?.email) return;

      setOrdersLoading(true);
      try {
        const result = await getOrdersByUser(session.user.email);
        console.log("Myorder result:", result);

        if (result.error) {
          console.error("Error fetching orders:", result.error);
          return;
        }
        
        if (result.orders) {
          setOrders(result.orders);
          setOrdersTotalPages(result.totalPages || 1);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (activeTab === "bookings") {
      fetchUserOrder();
    }
  }, [activeTab, session]);
  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  const stats = [
    { label: "Trips", value: 0 },
    { label: "Countries", value: 0 },
    { label: "Points", value: 0 },
  ];

  return (
    <div className="flex justify-center p-4 md:p-8 mt-24">
      <Card className="w-full max-w-4xl shadow-xl rounded-2xl overflow-hidden border-0 bg-white/95 backdrop-blur-sm">
        <div className="relative h-40 bg-gradient-to-r from-primary-500 to-secondary-500">
          <div className="absolute -bottom-16 left-6">
            <Avatar className="h-32 w-32 border-4 border-white">
              <AvatarImage
                src={session?.user?.image || ""}
                alt="Profile Picture"
              />
              <AvatarFallback className="bg-white text-primary-500 text-2xl font-bold">
                {session?.user?.name?.charAt(0).toUpperCase()}
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
                  {orders.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {orders.length}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant={activeTab === "wishlist" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("wishlist")}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                  {wishlistCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {wishlistCount}
                    </Badge>
                  )}
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
                          <p className="font-medium">
                            {" "}
                            {session?.user?.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              {activeTab === "bookings" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">My Bookings</h3>

                  {ordersLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <p>Loading your bookings...</p>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order._id} className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-medium">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Booked on{" "}
                                {new Date(
                                  order.bookingDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                order.status === "confirmed"
                                  ? "default"
                                  : order.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>

                          <Separator className="my-3" />

                          <div className="space-y-3">
                            {order.trips.map((trip, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3"
                              >
                                {trip.product.images &&
                                  trip.product.images.length > 0 && (
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                      <Image
                                        src={
                                          trip.product.images[0] ||
                                          "/placeholder-destination.jpg"
                                        }
                                        alt={trip.product.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {trip.product.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {trip.quantity}{" "}
                                    {trip.quantity > 1 ? "people" : "person"} •
                                    ${trip.price}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <Separator className="my-3" />

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              {order.trips.length}{" "}
                              {order.trips.length > 1 ? "items" : "item"}
                            </p>
                            <p className="font-bold">
                              Total: ${order.totalAmount}
                            </p>
                          </div>
                        </Card>
                      ))}

                      {/* Pagination */}
                      {ordersTotalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={ordersPage === 1}
                            onClick={() => setOrdersPage((prev) => prev - 1)}
                          >
                            Previous
                          </Button>
                          <span className="flex items-center px-3 text-sm">
                            Page {ordersPage} of {ordersTotalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={ordersPage === ordersTotalPages}
                            onClick={() => setOrdersPage((prev) => prev + 1)}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="font-medium text-gray-500">
                        No bookings yet
                      </h4>
                      <p className="text-sm text-gray-400 mb-4">
                        You haven't made any bookings yet. Start planning your
                        next adventure!
                      </p>
                      <Button onClick={() => router.push("/destinations")}>
                        Explore Destinations
                      </Button>
                    </Card>
                  )}
                </div>
              )}
              {activeTab === "wishlist" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Saved Destinations</h3>
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <p>Loading your wishlist...</p>
                    </div>
                  ) : wishlistData && wishlistData.items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlistData.items.map((item) => (
                        <Card
                          key={item.productId._id}
                          className="group overflow-hidden"
                        >
                          <div className="relative h-40">
                            <Image
                              src={
                                item.productId.image ||
                                "/placeholder-destination.jpg"
                              }
                              alt={item.productId.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <Heart className="absolute top-3 right-3 h-6 w-6 text-red-500 fill-red-500" />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-medium">
                              {item.productId.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {item.productId.location}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              Saved on{" "}
                              {new Date(item.addedAt).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h4 className="font-medium text-gray-500">
                        No saved destinations
                      </h4>
                      <p className="text-sm text-gray-400 mb-4">
                        Your wishlist is empty. Start saving your favorite
                        destinations!
                      </p>
                      <Button onClick={() => router.push("/destinations")}>
                        Explore Destinations
                      </Button>
                    </Card>
                  )}
                </div>
              )}
              {activeTab === "payments" && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Payment Methods</h3>
                  <Card className="p-4">
                    <div className="text-center text-gray-500">
                      <CreditCard className="h-12 w-12 mx-auto mb-4" />
                      <p>No payment methods added yet</p>
                    </div>
                  </Card>
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
