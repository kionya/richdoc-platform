import { useTranslations } from "next-intl";

type Key = "priceDisclaimer" | "reviewDisclaimer" | "screeningNotice";

export default function ComplianceNotice({ k, className = "" }: { k: Key; className?: string }) {
  const t = useTranslations("Compliance");
  return <p className={`text-xs text-gray-400 ${className}`}>{t(k)}</p>;
}
