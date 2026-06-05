import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};

// Wrap with next-pwa only in production
const withPWA =
  process.env.NODE_ENV === 'production'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('next-pwa')({
        dest: 'public',
        register: true,
        skipWaiting: true,
        disable: false,
      })
    : (config: NextConfig) => config;

export default withPWA(nextConfig);
