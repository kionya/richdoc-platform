"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth-actions";
import { canTransition } from "@/lib/booking/status";

export async function updateBookingStatus(id: string, next: string): Promise<void> {
  await requireAdmin();
  const b = await db.booking.findUnique({ where: { id } });
  if (!b) return;
  if (!canTransition(b.status, next)) {
    console.warn(`[booking] 잘못된 전이 ${b.status}→${next}`);
    return;
  }
  await db.booking.update({ where: { id }, data: { status: next } });
  revalidatePath("/admin/bookings");
}
