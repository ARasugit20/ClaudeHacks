/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['sao-snapshot-herein-poster.trycloudflare.com'],
  turbopack: {
    root: __dirname,
  },
  transpilePackages: ['react-map-gl', 'mapbox-gl'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;