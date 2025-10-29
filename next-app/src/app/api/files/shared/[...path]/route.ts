import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { GetObjectCommand, NoSuchKey } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "@/util/envConfigLoader";
import { s3 } from "@/util/api/s3-client";
import { checkGroupAccess, extractUserId } from "@/util/api/files-common";

type ParamsType = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(req: NextRequest, { params }: ParamsType) {
  const userId = await extractUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pathParts = (await params)?.path || [];
  if (!pathParts || pathParts.length === 0) {
    return NextResponse.json(
      { error: "No file path provided" },
      { status: 400 }
    );
  }

  // should be groupId=<groupId>/file=<fileId> || file=<fileId>
  const groupId = pathParts[0].startsWith("groupId=")
    ? pathParts[0].split("=")[1]
    : null;

  const hasAccess = await checkGroupAccess({ groupId, userId });
  if (!hasAccess && groupId) {
    return NextResponse.json(
      { error: "Forbidden, user does not have access to this group" },
      { status: 403 }
    );
  }

  try {
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: config.AWS_S3_BUCKET_NAME,
        Key: pathParts.join("/"),
      }),
      { expiresIn: 60 } //60s
    );
    return NextResponse.redirect(url);
  } catch (error: NoSuchKey | unknown) {
    if (error instanceof NoSuchKey) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    throw error; //rethrow other errors
  }
}
