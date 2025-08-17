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
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { contactUs } from "../actions/contact.actions";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    travelType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    try {
      const res = await contactUs(formData);
      if (res.success) {
        toast.success(res.message || "Message sent successfully");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          travelType: "",
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

  return (
    <section id="contact" className="py-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-6 px-4 py-2 text-primary-600">
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Us
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Let's Craft Your <span className=" bg-clip-text  text-blue-600">Perfect Journey</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Information */}
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
                      <a href="tel:+919310682414" className="hover:text-primary-600 transition-colors">
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
                      <a href="mailto:info@cloudshipholidays.com" className="hover:text-primary-600 transition-colors">
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
                    <p className="text-gray-600">
                      Sunday: 10:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className=" bg-primary-500  rounded-2xl p-8 text-white">
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

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardHeader className=" bg-primary-600 text-white py-8">
                <CardTitle className="text-3xl font-bold">
                  Personalized Travel Consultation
                </CardTitle>
                <p className="text-primary-100 opacity-90">
                  Complete this form and we'll craft a custom itinerary just for you
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="mb-2 block font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="h-12 px-4 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="mb-2 block font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="h-12 px-4 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="mb-2 block font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="h-12 px-4 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="+91 1234567890"
                      />
                    </div>
                    <div>
                      <Label htmlFor="travelType" className="mb-2 block font-medium text-gray-700">
                        Travel Type
                      </Label>
                      <Select
                        value={formData.travelType}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, travelType: value })
                        }
                      >
                        <SelectTrigger className="h-12 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                          <SelectValue placeholder="Select travel purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="honeymoon">Romantic Getaway</SelectItem>
                          <SelectItem value="family">
                            Family Vacation
                          </SelectItem>
                          <SelectItem value="adventure">
                            Adventure Expedition
                          </SelectItem>
                          <SelectItem value="luxury">Luxury Escape</SelectItem>
                          <SelectItem value="business">
                            Business Travel
                          </SelectItem>
                          <SelectItem value="group">Group Tour</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="mb-2 block font-medium text-gray-700">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                      className="h-12 px-4 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="How can we assist you?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="mb-2 block font-medium text-gray-700">
                      Your Travel Vision *
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={6}
                      className="px-4 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Tell us about your dream destinations, travel dates, budget, special requirements, and any other details that will help us create your perfect itinerary..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg  ng-primary-600 hover:from-primary-700 hover:to-secondary-600 shadow-lg transition-all"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                    We respect your privacy. Your information will never be shared.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}