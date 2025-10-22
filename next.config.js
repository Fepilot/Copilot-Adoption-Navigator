/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Copilot-Adoption-Navigator' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Copilot-Adoption-Navigator/' : '',
  trailingSlash: true,
}

module.exports = nextConfig
