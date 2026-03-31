import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",         // optional, usually empty
        pathname: "/**",  // match all paths
      },
    ]
  }
};

export default nextConfig;
