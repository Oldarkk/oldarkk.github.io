/** @type {import('next').NextConfig} */
const nextConfig = {

  output: 'export',

  // Strip X-Powered-By header
  poweredByHeader: false,

  // Enable gzip/brotli compression
  compress: true,

  // Image optimisation — allow external sources used in Projects section
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Tree-shake lucide-react so only imported icons end up in the bundle
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
