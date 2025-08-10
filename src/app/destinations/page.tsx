import { Suspense } from "react"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
import DestinationsList from "./components/destinations-list"

export default function DestinationsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Explore Destinations</h1>
            <p className="text-xl md:text-2xl text-blue-100">Discover amazing places around the world</p>
          </div>
        </div>
        <Suspense fallback={<div>Loading destinations...</div>}>
          <DestinationsList />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
