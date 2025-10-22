"server-only";

import {
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import * as fs from "fs";
import { config } from "@/util/envConfigLoader";
import s3Connect from "@/util/create-s3-client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const { S3_BUCKET_NAME, URL_EXPIRATION_TIME_SECONDS } = config;

export async function uploadFileToS3(key: string, filePath: string) {
  const s3 = await s3Connect();
  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: fs.readFileSync(filePath),
    })
  );
  s3.destroy();
}

export async function getObjectFromS3(key: string) {
  const s3 = await s3Connect();

  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: URL_EXPIRATION_TIME_SECONDS }
  );

  return signedUrl;
}

export async function getFileNamesInS3Folder(
  prefix: string
): Promise<string[]> {
  const s3 = await s3Connect();
  const listedObjects = await s3.send(
    new ListObjectsV2Command({
      Bucket: S3_BUCKET_NAME,
      Prefix: prefix,
    })
  );

  return listedObjects.Contents
    ? listedObjects.Contents.map((obj) => obj.Key).filter(
        (k): k is string => k !== undefined
      )
    : [];
}
