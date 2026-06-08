// 표시/열거용 순서(폼·필터 옵션). 정렬 우선순위가 아님 — 우선순위는 tierRank()가 결정한다.
export const HOSPITAL_TIERS = ["RECOMMENDED", "PARTNER", "BENEFIT"] as const;
export type Tier = (typeof HOSPITAL_TIERS)[number];

export function tierRank(tier: string): number {
  switch (tier) {
    case "BENEFIT": return 0;
    case "PARTNER": return 1;
    default: return 2; // RECOMMENDED 및 알 수 없는 값
  }
}

export function compareHospitalsByTier(
  a: { tier: string; rating: number },
  b: { tier: string; rating: number },
): number {
  const r = tierRank(a.tier) - tierRank(b.tier);
  if (r !== 0) return r;
  return b.rating - a.rating; // 동급은 평점 내림차순
}
