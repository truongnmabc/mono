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
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'cdl-prep.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
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
  },
  output: 'standalone',
  outputFileTracingRoot: __dirname,
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
