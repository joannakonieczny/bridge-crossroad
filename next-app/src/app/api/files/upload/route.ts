import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { config } from "@/util/envConfigLoader";
import { getUserId } from "@/services/auth/server-only/user-id";
import { getUserData } from "@/repositories/onboarding";

const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    sessionToken: config.AWS_SESSION_TOKEN,
  },
});

export async function POST(req: NextRequest) {
  const userId = await getUserId({}).catch(() => null);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const groupId = req.nextUrl.searchParams.get("groupId"); //folderPath
  if (groupId) {
    //check if user is member of group if groupId provided
    const user = await getUserData(userId);
    const hasAccess =
      !!user &&
      !!user.groups &&
      user.groups.some((userGroupId) => {
        return groupId === userGroupId.toString();
      });
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Forbidden, user does not have access to this group" },
        { status: 403 }
      );
    }
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // size limit (10 MB)
  const MAX_SIZE = 10 * 1024 * 1024;
  // Files from Next Request may have `.size`
  const fileSize = file?.size;
  if (typeof fileSize === "number" && fileSize > MAX_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }
  //rejectuj za duzy plik, akceptuj tylko bezpieczne typy plikow

  // Whitelist bezpiecznych MIME types i extensions
  const ALLOWED_MIME = new Set<string>([
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
    "application/pdf",
    "text/plain",
    "application/zip",
  ]);

  const ALLOWED_EXT = new Set<string>([
    "png",
    "jpg",
    "jpeg",
    "webp",
    "gif",
    "pdf",
    "txt",
    "zip",
  ]);

  const fileExtension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const mimeType = file?.type || "";

  if (!ALLOWED_MIME.has(mimeType) || !ALLOWED_EXT.has(fileExtension)) {
    return NextResponse.json(
      { error: "Unsupported media type" },
      { status: 415 }
    );
  }
  const fileName = `file=${randomUUID()}${new Date().getTime()}.${fileExtension}`;

  const fullPath = groupId ? `groupId=${groupId}/${fileName}` : fileName;

  const arrayBuffer = await file.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 413 });
  }
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
