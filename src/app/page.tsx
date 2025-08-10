import Navbar from "./components/navbar"
import HeroSection from "./components/hero-section"
import DestinationShowcase from "./components/destination-showcase"
import BookingWidget from "./components/booking-widget"
import SpecialOffers from "./components/special-offers"
import Testimonials from "./components/testimonials"
import AboutUs from "./components/about-us"
import BlogSection from "./components/blog-section"
import ContactSection from "./components/contact-section"
import Footer from "./components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <HeroSection />
      <DestinationShowcase />
      <BookingWidget />
      <SpecialOffers />
      <Testimonials />-----
      <AboutUs />
      <BlogSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
