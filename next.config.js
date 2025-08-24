/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    legacyBrowsers: true, // enables transpilation for old Safari
    browsersListForSwc: true, // use browserslist to target old browsers
  },
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
