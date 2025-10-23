import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "@/util/envConfigLoader";

const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    sessionToken: config.AWS_SESSION_TOKEN,
  },
});

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const pathParts = params?.path || [];
    if (!pathParts || pathParts.length === 0) {
      return NextResponse.json(
        { error: "Brak ścieżki pliku" },
        { status: 400 }
      );
    }

    const fullPath = pathParts.join("/");

    const command = new GetObjectCommand({
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: fullPath,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60s

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Błąd podczas generowania URL" },
      { status: 500 }
    );
  }
}
