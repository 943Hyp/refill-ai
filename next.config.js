/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'source.unsplash.com', 'replicate.delivery'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.replicate.delivery',
      },
    ],
  },
};

module.exports = nextConfig;
