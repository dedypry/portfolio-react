/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow optimized images for any future remote sources we may add.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons", "framer-motion"],
  },
};

export default nextConfig;
