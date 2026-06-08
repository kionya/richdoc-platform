import { setRequestLocale, getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { resolveText } from "@/lib/i18n/text";
import { Link } from "@/i18n/navigation";

export default async function BookingSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ code?: string; group?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { code, group } = await searchParams;
  const t = await getTranslations("Booking");

  const bookings = group
    ? await db.booking.findMany({ where: { groupId: group }, include: { hospital: true } })
    : code
    ? await db.booking.findMany({ where: { code }, include: { hospital: true } })
    : [];

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
        ✓
      </div>
      <h1 className="text-2xl font-bold mb-3">{t("successTitle")}</h1>
      <p className="text-sm text-gray-500 mb-6">{t("notConfirmed")}</p>
      <div className="bg-white border rounded-xl p-5 mb-6 text-left">
        {bookings.length === 0 ? (
          <p className="text-gray-400">-</p>
        ) : (
          bookings.map((b) => (
            <div
              key={b.id}
              className="flex justify-between border-b border-gray-50 py-2 last:border-0"
            >
              <span className="text-gray-700">{resolveText(b.hospital.name, locale)}</span>
              <span className="font-bold text-blue-600">
                {t("yourCode")}: {b.code}
              </span>
            </div>
          ))
        )}
      </div>
      {bookings.some((b) => b.email) && (
        <p className="text-xs text-gray-400 mb-6">{t("emailedNote")}</p>
      )}
      <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">
        {t("backHome")}
      </Link>
    </div>
  );
}
