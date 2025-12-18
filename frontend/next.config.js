const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false, // Use pages directory
  },
  images: {
    domains: ['cdn.mock', 'localhost'],
  },
}

module.exports = nextConfig
