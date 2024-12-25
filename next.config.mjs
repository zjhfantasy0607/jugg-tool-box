/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1'
      },
      {
        protocol: 'http',
        hostname: 'ec2-15-168-9-3.ap-northeast-3.compute.amazonaws.com',
        port: '8080'
      },
      {
        protocol: 'http',
        hostname: '192.168.31.195',
        port: '8080'
      }
    ],
  },
};

export default nextConfig;
