import { LANGS, type I18nText, type Lang } from "./types";

export function toI18n(value: unknown): I18nText {
  const v = (value ?? {}) as Partial<Record<Lang, unknown>>;
  return {
    ko: typeof v.ko === "string" ? v.ko : "",
    en: typeof v.en === "string" ? v.en : "",
    zh: typeof v.zh === "string" ? v.zh : "",
    ja: typeof v.ja === "string" ? v.ja : "",
  };
}

export function resolveText(value: unknown, lang: Lang): string {
  const t = toI18n(value);
  // i18n 값은 사람이 읽는 텍스트라 빈 문자열만 폴백 대상 → || 단축평가로 충분
  return t[lang] || t.en || t.ko || "";
}

export function isCompleteI18n(value: unknown): boolean {
  const t = toI18n(value);
  return LANGS.every((l) => t[l].trim().length > 0);
}
