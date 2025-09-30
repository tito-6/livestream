/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false, // Use pages directory
  },
  // Allow external images for video.js and other assets
  images: {
    domains: ['cdn.mock', 'localhost'],
  },
}

module.exports = nextConfig
