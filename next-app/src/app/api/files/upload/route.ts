"server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { config } from "@/util/envConfigLoader";
import { fileTypeFromBuffer } from "file-type";
import {
  ALLOWED_EXT,
  ALLOWED_MIME,
  checkGroupAccess,
  extractUserId,
  MAX_SIZE,
} from "@/util/api/files-common";
import { s3 } from "@/util/api/s3-client";

export async function POST(req: NextRequest) {
  const userId = await extractUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const groupId = req.nextUrl.searchParams.get("groupId"); //folderPath

  const hasAccess = await checkGroupAccess({ groupId, userId });
  if (!hasAccess && groupId) {
    return NextResponse.json(
      { error: "Forbidden, user does not have access to this group" },
      { status: 403 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const fileSize = file?.size;
  if (typeof fileSize === "number" && fileSize > MAX_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const fileExtension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const mimeType = file?.type || "";
  const fileName = `file=${randomUUID()}${new Date().getTime()}.${fileExtension}`;

  const fullPath = groupId ? `groupId=${groupId}/${fileName}` : fileName;

  const arrayBuffer = await file.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }

  const uint8Buffer = new Uint8Array(arrayBuffer);
  const ft = await fileTypeFromBuffer(uint8Buffer);

  const detectedMime = ft?.mime ?? mimeType;
  const detectedExt = ft?.ext ?? fileExtension;

  if (!ALLOWED_MIME.has(detectedMime) || !ALLOWED_EXT.has(detectedExt)) {
    return NextResponse.json(
      { error: "Unsupported media type" },
      { status: 415 }
    );
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: fullPath,
      Body: uint8Buffer,
      ContentType: file.type,
    })
  );

  return NextResponse.json({ filePath: fullPath });
}
