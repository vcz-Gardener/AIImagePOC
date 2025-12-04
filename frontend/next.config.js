/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.llamagen.ai', 'storage.googleapis.com'],
  },
}

module.exports = nextConfig
