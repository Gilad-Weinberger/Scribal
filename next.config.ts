import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qernddcxdfopqzlljpex.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/scribal-bucket/**",
      },
    ],
  },
};

export default nextConfig;
