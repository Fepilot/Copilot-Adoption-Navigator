/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Copilot-Adoption-Navigator',
  assetPrefix: '/Copilot-Adoption-Navigator/',
}

module.exports = nextConfig
