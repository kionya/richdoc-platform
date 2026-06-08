import { describe, it, expect, beforeEach } from "vitest";
import { uploadBookingPhoto } from "./blob";

describe("uploadBookingPhoto — graceful skip (no network)", () => {
  beforeEach(() => {
    delete process.env.BLOB_READ_WRITE_TOKEN; // 토큰 없는 상태 보장
  });

  it("null 파일은 null", async () => {
    expect(await uploadBookingPhoto(null)).toBeNull();
  });

  it("빈 파일은 null", async () => {
    const f = new File([], "empty.jpg", { type: "image/jpeg" });
    expect(await uploadBookingPhoto(f)).toBeNull();
  });

  it("토큰 없으면 null (throw 안 함)", async () => {
    const f = new File([new Uint8Array(10)], "a.jpg", { type: "image/jpeg" });
    await expect(uploadBookingPhoto(f)).resolves.toBeNull();
  });

  it("토큰 있어도 5MB 초과면 null (put 호출 전 차단)", async () => {
    process.env.BLOB_READ_WRITE_TOKEN = "test-token";
    const big = new File([new Uint8Array(6 * 1024 * 1024)], "big.jpg", { type: "image/jpeg" });
    await expect(uploadBookingPhoto(big)).resolves.toBeNull();
  });

  it("토큰 있어도 이미지 아니면 null (put 호출 전 차단)", async () => {
    process.env.BLOB_READ_WRITE_TOKEN = "test-token";
    const txt = new File([new Uint8Array(10)], "a.txt", { type: "text/plain" });
    await expect(uploadBookingPhoto(txt)).resolves.toBeNull();
  });
});
