"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Calendar,
  Users,
  Plane,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { contactUs } from "../actions/contact.actions";

const DESTINATION_OPTIONS = [
  // Domestic
  "Kerala",
  "Himachal Pradesh", 
  "Sikkim",
  "Darjeeling",
  "Kashmir",
  "Goa",
  "Ladakh",
  "Rajasthan",
  "Andaman and Nicobar Islands",
  "Uttarakhand",
  "North East",
  "Assam",
  "Meghalaya",
  
  // International
  "Bali",
  "Singapore",
  "Thailand",
  "Dubai",
  "Malaysia",
  "Maldives",
  "Mauritius",
  "Vietnam",
  "Sri Lanka",
  "Turkey",
  "Azerbaijan",
  "Georgia",
  "Hong Kong",
  "Kazakhstan",
  
  "Other (please specify in details)",
];


const TRIP_PLANNING_STATUS = [
  "Travel date, destination and people travelling all finalized. Just looking for a package",
  "Definitely going on a trip. Planning in progress",
  "Thinking about going on a trip but nothing has been decided yet",
  "Looking for information only. Will plan later",
];

const TIME_TO_BOOK = [
  "I will book within 2-3 days",
  "I will book within a week",
  "I will book within a month",
  "Nothing decided as of now"
];
type FormDataState = {
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelDate: string;
  flightRequired: "Yes" | "No" | undefined;
  adults: number;
  children: number;
  tripPlanningStatus: string;
  timeToBook: string;
  additionalDetails: string;
};
export default function ContactSection() {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    email: "",
    phone: "",
    destination: "",
    travelDate: "",
    flightRequired: undefined,
    adults: 1,
    children: 0,
    tripPlanningStatus: "",
    timeToBook: "",
    additionalDetails: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await contactUs(formData);
      if (res.success) {
        toast.success(res.message || "Message sent successfully");
        setFormData({
          name: "",
          email: "",
          phone: "",
          destination: "",
          travelDate: "",
          flightRequired: undefined,
          adults: 1,
          children: 0,
          tripPlanningStatus: "",
          timeToBook: "",
          additionalDetails: "",
        });
      } else {
        toast.error(res.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section
      id="contact"
      className="py-10 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-primary-600">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Let's Craft Your{" "}
            <span className="bg-clip-text text-blue-600">Perfect Journey</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                How Can We Help?
              </h3>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 bg-primary-50 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                      Our Headquarters
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      Second Floor, A-245, Devli Rd, opp. Honda Showroom, near
                      Vishal Mega Mart, Khanpur Village, New Delhi, 110062
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 bg-secondary-50 p-3 rounded-xl">
                    <Phone className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                      Call Directly
                    </h4>
                    <p className="text-gray-600">
                      <a
                        href="tel:+919310682414"
                        className="hover:text-primary-600 transition-colors"
                      >
                        +91-9310682414
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 bg-blue-50 p-3 rounded-xl">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                      Email Us
                    </h4>
                    <p className="text-gray-600">
                      <a
                        href="mailto:info@cloudshipholidays.com"
                        className="hover:text-primary-600 transition-colors"
                      >
                        info@cloudshipholidays.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 bg-amber-50 p-3 rounded-xl">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                      Office Hours
                    </h4>
                    <p className="text-gray-600">
                      Monday - Saturday: 9:00 AM - 7:00 PM
                    </p>
                    <p className="text-gray-600">Sunday: 10:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Why Contact Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0">✓</span>
                  <span>Personalized travel planning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0">✓</span>
                  <span>24/7 customer support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0">✓</span>
                  <span>Exclusive deals and offers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0">✓</span>
                  <span>Local expert knowledge</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-8">
                <CardTitle className="text-3xl font-bold">
                  Personalized Travel Consultation
                </CardTitle>
                <p className="text-primary-100 opacity-90">
                  Complete this form and we'll craft a custom itinerary just for
                  you
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                    <Label
                      htmlFor="destination"
                      className="mb-2 block font-medium text-gray-700"
                    >
                      Where do you want to go?
                    </Label>
                    <Select
                      value={formData.destination}
                      onValueChange={(value) =>
                        handleInputChange("destination", value)
                      }
                    >
                      <SelectTrigger className="h-12 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {DESTINATION_OPTIONS.map((destination) => (
                          <SelectItem key={destination} value={destination}>
                            {destination}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="travelDate"
                      className="mb-2 block font-medium text-gray-700"
                    >
                      <Calendar className="inline h-4 w-4 mr-2" />
                      Date of Travel
                    </Label>
                    <Input
                      id="travelDate"
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) =>
                        handleInputChange("travelDate", e.target.value)
                      }
                      className="h-12 px-4 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="adults"
                        className="mb-2 block font-medium text-gray-700"
                      >
                        <Users className="inline h-4 w-4 mr-2" />
                        Adults (12+ years)
                      </Label>
                      <Select
                        value={formData.adults.toString()}
                        onValueChange={(value) =>
                          handleInputChange("adults", parseInt(value))
                        }
                      >
                        <SelectTrigger className="h-12 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                          <SelectValue placeholder="Number of adults" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 9 }, (_, i) => i + 1).map(
                            (num) => (
                              <SelectItem
                                key={`adult-${num}`}
                                value={num.toString()}
                              >
                                {num} {num === 1 ? "Adult" : "Adults"}
                              </SelectItem>
                            )
                          )}
                          <SelectItem key="adult-10" value="10">
                            10 Adults
                          </SelectItem>
                          <SelectItem key="adult-10-plus" value="11">
                            10+ Adults
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="children"
                        className="mb-2 block font-medium text-gray-700"
                      >
                        Children (0-11 years)
                      </Label>
                      <Select
                        value={formData.children.toString()}
                        onValueChange={(value) =>
                          handleInputChange("children", parseInt(value))
                        }
                      >
                        <SelectTrigger className="h-12 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                          <SelectValue placeholder="Number of children" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 5 }, (_, i) => i).map((num) => (
                            <SelectItem
                              key={`child-${num}`}
                              value={num.toString()}
                            >
                              {num} {num === 1 ? "Child" : "Children"}
                            </SelectItem>
                          ))}
                          <SelectItem key="child-5" value="5">
                            5 Children
                          </SelectItem>
                          <SelectItem key="child-5-plus" value="6">
                            5+ Children
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="flightRequired"
                      className="mb-2 block font-medium text-gray-700"
                    >
                      <Plane className="inline h-4 w-4 mr-2" />
                      Flight Required?
                    </Label>
                    <Select
                      value={formData.flightRequired}
                      onValueChange={(value) =>
                        handleInputChange("flightRequired", value)
                      }
                    >
                      <SelectTrigger className="h-12 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="tripPlanningStatus"
                        className="mb-2 block font-medium text-gray-700"
                      >
                        Trip Planning Status
                      </Label>
                      <Select
                        value={formData.tripPlanningStatus}
                        onValueChange={(value) =>
                          handleInputChange("tripPlanningStatus", value)
                        }
                      >
                        <SelectTrigger className="h-12 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {TRIP_PLANNING_STATUS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label
                        htmlFor="timeToBook"
                        className="mb-2 block font-medium text-gray-700"
                      >
                        Time to Book
                      </Label>
                      <Select
                        value={formData.timeToBook}
                        onValueChange={(value) =>
                          handleInputChange("timeToBook", value)
                        }
                      >
                        <SelectTrigger className="h-12 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                          <SelectValue placeholder="When will you book?" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_TO_BOOK.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="name"
                      className="mb-2 block font-medium text-gray-700"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      className="h-12 px-4 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="phone"
                        className="mb-2 block font-medium text-gray-700"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="h-12 px-4 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="+91 1234567890"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="mb-2 block font-medium text-gray-700"
                      >
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                        className="h-12 px-4 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="additionalDetails"
                      className="mb-2 block font-medium text-gray-700"
                    >
                      Additional Details
                    </Label>
                    <Textarea
                      id="additionalDetails"
                      value={formData.additionalDetails}
                      onChange={(e) =>
                        handleInputChange("additionalDetails", e.target.value)
                      }
                      rows={4}
                      className="px-4 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Any special requirements, budget constraints, preferred activities, or other details that will help us plan your perfect trip..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-700 shadow-lg transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <Send className="mr-3 h-5 w-5" />
                        Request Custom Itinerary
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    We respect your privacy. Your information will never be
                    shared.
                  </p>
                </form>
              </CardContent>
            </Card>
            
          </div>
        </div>
         <section id="faq">
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h3>
              <p className="text-xl text-gray-600">
                Quick answers to common questions about our services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  How far in advance should I book?
                </h4>
                <p className="text-gray-600">
                  We recommend booking 2-3 months in advance for the best prices
                  and availability. However, we can also help with last-minute
                  bookings.
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Do you offer travel insurance?
                </h4>
                <p className="text-gray-600">
                  Yes, we offer comprehensive travel insurance options to
                  protect your investment and provide peace of mind during your
                  travels.
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Can you help with visa requirements?
                </h4>
                <p className="text-gray-600">
                  Our team can assist with visa applications and provide
                  guidance on entry requirements for your destination.
                </p>
              </Card>

              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  What if I need to cancel my trip?
                </h4>
                <p className="text-gray-600">
                  We understand plans can change. We'll work with you and our
                  partners to minimize cancellation fees and explore rebooking
                  options.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
