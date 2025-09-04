import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Providers from "./providers";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
  title: "Cloudship Holidays - Best Flight Booking & Travel Packages in India",
  description: "Book flights, hotels, and holiday packages at best prices. Customized domestic & international travel packages with exclusive deals on adventure, luxury, beach, and family vacations.",
  keywords: "flight booking, holiday packages, travel agency, domestic tours, international trips, adventure travel, luxury vacations, beach holidays, family-friendly trips, hotel booking, cheap flights, tour packages, India travel",
  authors: [{ name: "Cloudship Holidays" }],
  creator: "Cloudship Holidays",
  publisher: "Cloudship Holidays",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.cloudshipholidays.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Cloudship Holidays - Best Flight Booking & Travel Packages",
    description: "Book flights, hotels, and holiday packages at best prices. Customized domestic & international travel packages.",
    url: 'https://www.cloudshipholidays.com',
    siteName: 'Cloudship Holidays',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloudship Holidays - Best Flight Booking & Travel Packages',
    description: 'Book flights, hotels, and holiday packages at best prices.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
  },
  category: 'travel',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body>
        <Providers session={session}>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
            <Navbar />
            <main className="pt-[120px]">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}