import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Supabase Storage images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Stripe webhook raw body
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
}

export default nextConfig
