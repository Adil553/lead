import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "hotmealzndealz.com",
      "http://192.168.18.4:9898/",
      "https://lh3.googleusercontent.com",
      "https://platform-lookaside.fbsbx.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hotmealzndealz.com",
        pathname: "/vehicleImages/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**", // Required for Google profile images
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "**", // Required for Facbook profile images
      },
      {
        protocol: "http",
        hostname: "192.168.18.4",
        port: "9898",
      },
    ],
  },
};

export default nextConfig;
