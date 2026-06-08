const FORBIDDEN: { pattern: RegExp; label: string }[] = [
  { pattern: /100\s*%/, label: "100%" },
  { pattern: /상위\s*1\s*%/, label: "상위 1%" },
  { pattern: /\bworld[-\s]?class\b/i, label: "world class" },
  { pattern: /government\s+verified/i, label: "government verified" },
  { pattern: /\bofficial\b/i, label: "official" },
  { pattern: /\bguarantee/i, label: "guarantee" },
  { pattern: /보장/, label: "보장" },
  { pattern: /완치/, label: "완치" },
  { pattern: /부작용\s*없/, label: "부작용 없음" },
  { pattern: /최고|국내\s*1\s*위|업계\s*1\s*위/, label: "최고/1위" },
  { pattern: /\bbest\b/i, label: "best" },
  { pattern: /no\s+side\s+effect/i, label: "no side effect" },
];

export function scanForbidden(text: string): string[] {
  return FORBIDDEN.filter((f) => f.pattern.test(text)).map((f) => f.label);
}
