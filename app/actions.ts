'use server'

import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createLead(formData: FormData) {
  
  const userName = formData.get("name") as string;
  const userContact = formData.get("contact") as string;
  const userConcern = formData.get("concern") as string;
  const hospitalId = formData.get("hospitalId") as string;
  
  // 1. 사진 파일 가져오기
  const photoFile = formData.get("photo") as File;
  let photoData = null;

  // 2. 사진이 있다면 '문자열'로 변환하기 (Base64 인코딩)
  if (photoFile && photoFile.size > 0) {
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    photoData = `data:${photoFile.type};base64,${buffer.toString("base64")}`;
  }

  const referralCode = `RD-${Math.floor(Math.random() * 10000)}`;

  // 임시 유저 생성
  const newUser = await db.user.create({
    data: {
      email: `${referralCode}@temp.com`,
      name: userName,
      phone: userContact,
    }
  });

  // 3. 사진 데이터(photoData)까지 함께 저장
  await db.lead.create({
    data: {
      referralCode: referralCode,
      status: "PENDING",
      concern: userConcern,
      hospitalId: hospitalId,
      userId: newUser.id,
      photo: photoData, // 👈 여기에 사진이 저장됩니다
    }
  });

  console.log(`✅ 상담 접수 완료 (사진 포함)! 코드: ${referralCode}`);

  redirect(`/success?code=${referralCode}`);
}