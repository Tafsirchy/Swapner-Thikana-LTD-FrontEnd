const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  transpilePackages: [
    '@photo-sphere-viewer/core',
    '@photo-sphere-viewer/markers-plugin',
    'three',
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': 'three',
    };
    return config;
  },
  turbopack: {
    root: '.',
    resolveAlias: {
      'three': 'three'
    }
  },
};

export default nextConfig;
