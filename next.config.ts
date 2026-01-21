import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 이건 남겨두세요! (타입스크립트 무시)
  },
  // ❌ eslint: { ... }  <-- 이 부분이 있으면 안 됩니다! 지워주세요.
};

export default nextConfig;