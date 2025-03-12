import { composePlugins, withNx } from '@nx/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  nx: {
    svgr: false,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'cdl-prep.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.dmca.com' },
      { protocol: 'https', hostname: 'asvab-prep.com' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
    ],
  },
  pageExtensions: ['jsx', 'js', 'tsx', 'ts'],
  experimental: {
    turbo: {
      rules: {
        '*.scss': {
          loaders: ['sass-loader'],
          as: '*.css',
        },
      },
    },
    optimizePackageImports: ['@mui/icons-material', '@mui/material'],
    optimizeCss: true,
  },
  async rewrites() {
    return [
      {
        source: `/full-length-${process.env['NEXT_PUBLIC_APP_SHORT_NAME']}-practice-tests`,
        destination: '/final-test',
      },
    ];
  },
  // output: 'standalone',
  outputFileTracingRoot: __dirname, // Đảm bảo đúng root
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
