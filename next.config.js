/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Otimizações de Performance
  compress: true, // Compressão gzip/brotli
  poweredByHeader: false, // Remove header X-Powered-By por segurança
  
  // Otimização de Imagens
  images: {
    formats: ['image/avif', 'image/webp'], // Formatos modernos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // Cache de 60 segundos
  },
  
  // Webpack Optimizations
  webpack: (config, { dev, isServer }) => {
    // Otimizar bundle em produção
    if (!dev && !isServer) {
      // Tree shaking e code splitting
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }
    
    return config;
  },
  
  // SWC Minification (mais rápido que Terser)
  swcMinify: true,
  
  // Experimental Features para Performance
  experimental: {
    // Otimizar fontes
    optimizeFonts: true,
    // Lazy load de módulos
    esmExternals: true,
  },
  
  // Headers de Performance
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|woff|woff2)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
