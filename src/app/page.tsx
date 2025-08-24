
import Navbar from "./components/navbar"

import DestinationShowcase from "./components/destination/destination-showcase"
import BookingWidget from "./components/booking-widget"
import SpecialOffers from "./components/special-offers"
import Testimonials from "./components/testimonials"
import AboutUs from "./components/about-us"
import BlogSection from "./components/blog-section"
import ContactSection from "./components/contact-section"
import Footer from "./components/footer"
import FloatWhatsapp from "./components/FloatWatsapp"
import HeroSection from "./components/home/hero-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <HeroSection/>
      <DestinationShowcase />
      {/* <BookingWidget /> */}
      {/* <SpecialOffers /> */}
      <FloatWhatsapp/>
      <Testimonials />
      <AboutUs />
      <BlogSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
// "use client"
// import { useState } from "react";

// export default function Home() {
//   const [flights, setFlights] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const searchFlights = async () => {
//     setLoading(true);
//     const res = await fetch(`/api/flights?origin=MAD&destination=NYC&departureDate=2025-09-10`);
//     const data = await res.json();
//     setFlights(data.data || []);

//     setLoading(false);
//   };
// console.log(flights )
//   return (
//     <div>
//       <button onClick={searchFlights} disabled={loading}>
//         {loading ? "Searching..." : "Search Flights"}
//       </button>

//       <ul>
//         {flights.map((flight: any, i) => (
//           <li key={i}>
//             {flight.itineraries[0].segments[0].departure.iataCode} →{" "}
//             {flight.itineraries[0].segments.slice(-1)[0].arrival.iataCode} —{" "}
//             {flight.price.total} {flight.price.currency}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
