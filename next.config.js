/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdf-parse': 'pdf-parse/lib/pdf-parse.js',
    };
    return config;
  },
  env: {
    AWS_REGION: process.env.AWS_REGION,
  },
}

module.exports = nextConfig 