import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@clerk/nextjs'],
  },
  
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable SWC minification for better performance
  swcMinify: true,
};

export default nextConfig;
