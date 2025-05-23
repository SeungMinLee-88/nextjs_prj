/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    
  },
  module: {
    reactStrictMode: false,
    ignoreBuildErrors: true,
  }
}
