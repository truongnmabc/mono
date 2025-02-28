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
      {
        protocol: 'https',
        hostname: 'images.dmca.com',
      },
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
  // webpack: (config, { isServer }) => {
  //   config.optimization = {
  //     ...config.optimization,
  //     usedExports: true,
  //     sideEffects: true,
  //   };
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     moment$: 'moment/moment.js',
  //   };

  //   return config;
  // },

  // async rewrites() {
  //   const result = Object.keys(data.rewrite).map((key) => ({
  //     source: key,
  //     destination: ,
  //   }));

  //     return result;

  // },
  output: 'standalone',
  outputFileTracingRoot: __dirname,
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
