/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  experimental: {
    legacyBrowsers: true,
  },
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  
};

module.exports = nextConfig;
