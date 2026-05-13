import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  webpack(config) {
    // SVGR 로더 추가
    config.module.rules.push({
      test: /\.svg$/,
      include: [path.resolve(__dirname, 'assets')],
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
            typescript: true,
          },
        },
      ],
    });
    return config;
  },

  turbopack: {
    rules: {
      './assets/**/*.svg': {
        loaders: [
          {
            loader: require.resolve('@svgr/webpack'),
            options: {
              icon: true,
              typescript: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/ttule-media/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
