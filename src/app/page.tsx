import Navbar from "./components/navbar";

import DestinationShowcase from "./components/destination/destination-showcase";
import BookingWidget from "./components/booking-widget";
import SpecialOffers from "./components/special-offers";
import Testimonials from "./components/testimonials";
import AboutUs from "./components/about-us";
import BlogSection from "./components/blog-section";
import ContactSection from "./components/contact-section";
import Footer from "./components/footer";
import FloatWhatsapp from "./components/FloatWatsapp";
import HeroSection from "./components/home/hero-section";
import FlightBooking from "./components/Flight";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      <HeroSection />
      <FlightBooking />
      <BookingWidget />
      <DestinationShowcase />
      <SpecialOffers />
      <FloatWhatsapp />
      <Testimonials />
      <AboutUs />
      <BlogSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
