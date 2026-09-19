/*import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "**",
      },
      // Si realmente necesitas el hostname local para pruebas en red:
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
*/
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "*.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "ui-avatars.com", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "3001", pathname: "/**" },
    ],
  },
};

export default nextConfig;