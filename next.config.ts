import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // 타입스크립트 에러는 여기서 무시
    ignoreBuildErrors: true,
  },
  // ❌ eslint 설정은 여기서 삭제했습니다.
};

export default nextConfig;