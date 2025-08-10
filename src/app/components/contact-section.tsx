"use client";

import type React from "react";

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
  const router = useRouter();
  const { data: session, status } = useSession();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    console.log("Session data:", session);

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    const res = await contactUs(formData);

    if (res.success) {
      toast.success(res.message || "Message sent successfully");
      alert(
        "Thank you for your message! We'll get back to you within 24 hours."
      );
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
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-secondary-100 text-secondary-700 hover:bg-secondary-200">
            💬 Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Let's Plan Your Next
            <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Adventure Together
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to embark on your dream vacation? Our travel experts are here
            to help you create the perfect itinerary tailored to your
            preferences and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Visit Our Office
                    </h4>
                    <p className="text-gray-600">
                      123 Travel Street
                      <br />
                      New York, NY 10001
                      <br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-100 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Call Us
                    </h4>
                    <p className="text-gray-600">
                      +1 (555) 123-4567
                      <br />
                      +1 (555) 987-6543
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary-100 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Email Us
                    </h4>
                    <p className="text-gray-600">
                      info@wanderlust.com
                      <br />
                      support@wanderlust.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-secondary-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Business Hours
                    </h4>
                    <p className="text-gray-600">
                      Mon - Fri: 9:00 AM - 6:00 PM
                      <br />
                      Sat: 10:00 AM - 4:00 PM
                      <br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Chat */}
            <Card className="border-2 border-primary-200 bg-gradient-to-br from-primary-50 to-secondary-50">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Need Immediate Help?
                </h4>
                <p className="text-gray-600 mb-4">
                  Chat with our travel experts right now for instant assistance.
                </p>
                <Button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600">
                  Start Live Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0">
              <CardHeader className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
                <CardTitle className="text-2xl font-heading">
                  Send Us a Message
                </CardTitle>
                <p className="text-primary-100">
                  Fill out the form below and we'll get back to you within 24
                  hours.
                </p>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="travelType">Travel Type</Label>
                      <Select
                        value={formData.travelType}
                        onValueChange={(value: any) =>
                          setFormData({ ...formData, travelType: value })
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Select travel type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="honeymoon">Honeymoon</SelectItem>
                          <SelectItem value="family">
                            Family Vacation
                          </SelectItem>
                          <SelectItem value="adventure">
                            Adventure Travel
                          </SelectItem>
                          <SelectItem value="luxury">Luxury Travel</SelectItem>
                          <SelectItem value="business">
                            Business Travel
                          </SelectItem>
                          <SelectItem value="group">Group Travel</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                      className="h-12"
                      placeholder="What can we help you with?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                      rows={6}
                      placeholder="Tell us about your dream vacation, preferred destinations, travel dates, budget, or any specific requirements..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 h-12"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>

                  <p className="text-sm text-gray-600 text-center">
                    By submitting this form, you agree to our privacy policy and
                    terms of service.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
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
                Yes, we offer comprehensive travel insurance options to protect
                your investment and provide peace of mind during your travels.
              </p>
            </Card>

            <Card className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Can you help with visa requirements?
              </h4>
              <p className="text-gray-600">
                Our team can assist with visa applications and provide guidance
                on entry requirements for your destination.
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
      </div>
    </section>
  );
}
