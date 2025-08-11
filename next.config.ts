import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images: {
    domains: ["avatar.iran.liara.run"], // ✅ Allow avatar service
  },
};

export default nextConfig;
