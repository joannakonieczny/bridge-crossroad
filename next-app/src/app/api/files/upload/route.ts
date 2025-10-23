import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { config } from "@/util/envConfigLoader";

const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    sessionToken: config.AWS_SESSION_TOKEN,
  },
});

export async function POST(req: NextRequest) {
  const folderPath = req.nextUrl.searchParams
    .get("path")
    ?.replace(/^\/+|\/+$/g, "");

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const fileExtension = file.name.split(".").pop();
  const fileName = `${randomUUID()}${new Date().getTime()}.${fileExtension}`;

  const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await s3.send(
    new PutObjectCommand({
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: fullPath,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return NextResponse.json({ filePath: fullPath });
}
