import { Suspense } from "react"
import Navbar from "../../components/navbar"
import Footer from "../../components/footer"
import DestinationDetail from "./components/destination-detail"

interface PageProps {
  params: { id: string }
}

export default function DestinationDetailPage({ params }: PageProps) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Suspense fallback={<div>Loading destination details...</div>}>
          <DestinationDetail id={params.id} />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
