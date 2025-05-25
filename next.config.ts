import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // 暂时禁用字体优化以解决 Turbopack 兼容性问题
  optimizeFonts: false,
};

export default nextConfig;
