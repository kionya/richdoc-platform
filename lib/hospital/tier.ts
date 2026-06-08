export const HOSPITAL_TIERS = ["RECOMMENDED", "PARTNER", "BENEFIT"] as const;
export type Tier = (typeof HOSPITAL_TIERS)[number];
