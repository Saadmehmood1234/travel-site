"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  LogOut,
  Heart,
  Package,
  User,
  CreditCard,
  FileText,
  X,
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
import { Badge } from "@/components/ui/badge";
import SignOutButton from "./SignOutButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  getWishlistCount,
  getWishlistWithProducts,
} from "../actions/wishlist.actions.ts";
import { getOrdersByUser } from "../actions/order.actions";
import Invoice from "./Invoice";
import { IOrder, OrdersResponse } from "@/types/order";

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

export function Profile() {
  const [activeTab, setActiveTab] = useState("account");
  const [wishlistData, setWishlistData] = useState<WishlistData | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
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
          const convertedOrders: IOrder[] = result.orders.map((order: any) => ({
            ...order,
            bookingDate: new Date(order.bookingDate),
            createdAt: new Date(order.createdAt),
            updatedAt: new Date(order.updatedAt),
            trips: order.trips.map((trip: any) => ({
              ...trip,
              selectedDate: new Date(trip.selectedDate),
              product:
                typeof trip.product === "object"
                  ? trip.product
                  : { _id: trip.product, name: "", images: [] },
            })),
          }));
          setOrders(convertedOrders);
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

  const handleViewInvoice = (order: IOrder) => {
    setSelectedOrder(order);
    setIsInvoiceOpen(true);
  };

  const closeInvoice = () => {
    setIsInvoiceOpen(false);
    setSelectedOrder(null);
  };

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

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
                            {order.trips.map((trip, index) => {
                              const isProductPopulated = (
                                product: any
                              ): product is {
                                _id: string;
                                name: string;
                                images: string[];
                              } => {
                                return (
                                  typeof product === "object" &&
                                  product !== null &&
                                  "name" in product
                                );
                              };

                              const product = isProductPopulated(trip.product)
                                ? trip.product
                                : {
                                    _id: trip.product.toString(),
                                    name: "Unknown Product",
                                    images: [],
                                  };

                              const tripName = trip.name || product.name;
                              const tripImage =
                                product.images && product.images.length > 0
                                  ? product.images[0]
                                  : null;

                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-3"
                                >
                                  {tripImage && (
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                      <Image
                                        src={
                                          tripImage ||
                                          "/placeholder-destination.jpg"
                                        }
                                        alt={tripName}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium">{tripName}</p>
                                    <p className="text-sm text-gray-500">
                                      {trip.quantity}{" "}
                                      {trip.quantity > 1 ? "people" : "person"}{" "}
                                      • ₹{trip.price}
                                    </p>
                                    {trip.location && (
                                      <p className="text-sm text-gray-400">
                                        {trip.location}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <Separator className="my-3" />
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              {order.trips.length}{" "}
                              {order.trips.length > 1 ? "items" : "item"}
                            </p>
                            <p className="font-bold">
                              Total: ₹{order.totalAmount}
                            </p>
                          </div>
                          <div className="mt-4">
                            <Button
                              onClick={() => handleViewInvoice(order)}
                              variant="outline"
                              className="w-full flex items-center gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              View Invoice
                            </Button>
                          </div>
                        </Card>
                      ))}
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
            </div>
          </div>
        </div>
        <CardFooter className="flex justify-end p-6 border-t">
          <SignOutButton />
        </CardFooter>
      </Card>

      {isInvoiceOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">Invoice</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeInvoice}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <Invoice
                order={{
                  ...selectedOrder,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
