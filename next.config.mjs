/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: '/api/uploads/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb", // Increase limit here
    },
  },
};

export default nextConfig;
