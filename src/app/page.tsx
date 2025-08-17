import DestinationShowcase from "./components/destination/destination-showcase"
import BookingWidget from "./components/booking-widget"
import SpecialOffers from "./components/special-offers"
import Testimonials from "./components/testimonials"
import AboutUs from "./components/about-us"
import ContactSection from "./components/contact-section"
import Footer from "./components/footer"
import FloatWhatsapp from "./components/FloatWatsapp"
import HeroSection from "./components/home/hero-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <HeroSection />
      <DestinationShowcase />
      <BookingWidget />
      <SpecialOffers />
      <FloatWhatsapp/>
      <Testimonials />
      <AboutUs />
      <ContactSection />
      <Footer />
    </div>
  )
}