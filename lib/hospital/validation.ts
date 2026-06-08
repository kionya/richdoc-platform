import { isCompleteI18n } from "@/lib/i18n/text";
import type { I18nText } from "@/lib/i18n/types";
import type { HospitalInput } from "./types";

export const HOSPITAL_CATEGORIES = ["PLASTIC", "DERMA", "DENTAL", "OPHTHALMOLOGY", "HAIR", "ETC"] as const;
export type HospitalCategory = (typeof HOSPITAL_CATEGORIES)[number];

export function validateHospitalInput(input: HospitalInput): string[] {
  const errors: string[] = [];
  if (!input.slug.trim()) errors.push("slug는 필수입니다.");
  if (!input.city.trim()) errors.push("city는 필수입니다.");
  if (!input.district.trim()) errors.push("district는 필수입니다.");
  if (!HOSPITAL_CATEGORIES.includes(input.category as HospitalCategory)) errors.push("category가 올바르지 않습니다.");

  const i18nFields: [string, I18nText][] = [
    ["name", input.name], ["intro", input.intro], ["about", input.about],
    ["address", input.address], ["cautions", input.cautions],
  ];
  for (const [key, val] of i18nFields) {
    if (!isCompleteI18n(val)) errors.push(`${key}: 4개 언어(KR/EN/CN/JP) 모두 입력해야 합니다.`);
  }

  input.doctors.forEach((d, i) => {
    if (!isCompleteI18n(d.name)) errors.push(`의료진 ${i + 1}: 이름 4개 언어 필수`);
    if (!isCompleteI18n(d.specialty)) errors.push(`의료진 ${i + 1}: 전문분야 4개 언어 필수`);
  });
  input.menus.forEach((m, i) => {
    if (!isCompleteI18n(m.name)) errors.push(`시술 ${i + 1}: 시술명 4개 언어 필수`);
    if (!isCompleteI18n(m.priceText)) errors.push(`시술 ${i + 1}: 가격표기 4개 언어 필수`);
  });
  const VALID_TIERS = ["RECOMMENDED", "PARTNER", "BENEFIT"];
  if (!VALID_TIERS.includes(input.tier)) {
    errors.push("tier가 올바르지 않습니다.");
  }
  if (input.tier === "BENEFIT" && !isCompleteI18n(input.benefits)) {
    errors.push("benefits: 베네핏 등급은 추가혜택 4개 언어 필수입니다.");
  }
  return errors;
}
