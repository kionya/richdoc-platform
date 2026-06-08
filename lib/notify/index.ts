import { sendEmail } from "./email";
import { sendTelegram } from "./telegram";
import { patientEmail, adminMessage, hospitalEmail, type BookingLike } from "./templates";

type BookingRow = BookingLike & { hospitalId: string };
type HospitalInfo = { name: string; email: string };

// best-effort 병렬 발송. 예약 저장과 무관하게 실패해도 throw 안 함.
export async function sendBookingNotifications(
  bookings: BookingRow[],
  hospitalsById: Record<string, HospitalInfo>,
): Promise<void> {
  const jobs: Promise<unknown>[] = [];
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL || "";

  for (const b of bookings) {
    const h = hospitalsById[b.hospitalId] ?? { name: "(unknown)", email: "" };
    if (b.email) {
      const pe = patientEmail(b, h.name);
      jobs.push(sendEmail({ to: b.email, subject: pe.subject, html: pe.html }));
    }
    jobs.push(sendTelegram(adminMessage(b, h.name)));
    if (adminEmail) {
      const he = hospitalEmail(b, h.name);
      jobs.push(sendEmail({ to: adminEmail, subject: `[ADMIN] ${he.subject}`, html: he.html }));
    }
    if (h.email) {
      const he = hospitalEmail(b, h.name);
      jobs.push(sendEmail({ to: h.email, subject: he.subject, html: he.html }));
    }
  }
  await Promise.allSettled(jobs);
}
