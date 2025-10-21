"server-only";

import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import { config } from "@/util/envConfigLoader";
import s3Connect from "@/util/create-s3-client";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const { S3_BUCKET_NAME } = config;

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

export async function getFileFromS3(key: string, outputPath: string) {
  const s3 = await s3Connect();

  // const signedUrl = await getSignedUrl(s3, new GetObjectCommand({
  //     Bucket: S3_BUCKET_NAME,
  //     Key: key,
  // }), { expiresIn: 3600 });

  const command = new GetObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
  });

  const { Body } = await s3.send(command);
  const stream = Body as NodeJS.ReadableStream;
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  fs.writeFileSync(outputPath, Buffer.concat(chunks));
}
