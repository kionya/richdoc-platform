import { put } from "@vercel/blob";
import crypto from "crypto";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function uploadBookingPhoto(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn("[blob] BLOB_READ_WRITE_TOKEN 미설정 — 사진 업로드 스킵");
    return null;
  }
  if (file.size > MAX_BYTES) {
    console.warn("[blob] 파일 5MB 초과 — 스킵");
    return null;
  }
  if (!file.type.startsWith("image/")) {
    console.warn("[blob] 이미지 아님 — 스킵");
    return null;
  }
  try {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `bookings/${crypto.randomUUID()}-${safeName}`;
    const blob = await put(key, file, { access: "public" });
    return blob.url;
  } catch (e) {
    console.error("[blob] 업로드 실패:", e);
    return null;
  }
}
