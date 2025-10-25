/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' for server deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
