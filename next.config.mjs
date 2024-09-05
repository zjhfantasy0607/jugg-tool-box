/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: false,
    experimental: {
        serverActions: {
          bodySizeLimit: '3mb',
        },
    },
};

export default nextConfig;
