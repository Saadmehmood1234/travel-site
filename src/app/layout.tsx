import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Providers from "./providers";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
  title: "Cloudship",
  description: "Cloudship",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <div>
            <Navbar />
            <div className="pt-[30px]">
            {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
