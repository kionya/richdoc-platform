import type { I18nText } from "@/lib/i18n/types";

export type DayHours = { open: string; close: string; closed: boolean };
export type OperatingHours = {
  mon: DayHours; tue: DayHours; wed: DayHours; thu: DayHours;
  fri: DayHours; sat: DayHours; sun: DayHours;
  note: I18nText;
};

export type Messengers = {
  whatsapp: string; line: string; wechat: string; kakao: string;
  messenger: string; phone: string; email: string;
};

export type DoctorInput = { name: I18nText; specialty: I18nText; image: string; order: number };
export type MenuInput = {
  name: I18nText; category: string;
  price: number | null; priceText: I18nText; currency: string; order: number;
};

export type HospitalInput = {
  slug: string;
  name: I18nText; intro: I18nText; about: I18nText; address: I18nText;
  cautions: I18nText;
  city: string; district: string; category: string; tags: string; // 콤마구분 문자열 (Prisma의 String 컬럼과 1:1)
  image: string; images: string[];
  operatingHours: OperatingHours;
  messengers: Messengers;
  isPublished: boolean;
  doctors: DoctorInput[];
  menus: MenuInput[];
};
