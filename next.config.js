/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Pin the project root so a stray lockfile in a parent folder isn't picked up instead
    root: __dirname,
  },
}

module.exports = nextConfig
