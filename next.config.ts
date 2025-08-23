import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "avatar.iran.liara.run",
      "lh3.googleusercontent.com",
      "pixabay.com",
      "cdn.pixabay.com",
      "images.unsplash.com" // 👈 add this
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pixabay.com",
        port: "",
        pathname: "/get/**",
      },
    ],
  },
};

export default nextConfig;
