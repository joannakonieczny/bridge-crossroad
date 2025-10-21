"server-only";

import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";
import type { BucketLocationConstraint } from "@aws-sdk/client-s3";
import { config } from "@/util/envConfigLoader";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN,
  AWS_REGION,
  S3_BUCKET_NAME,
} = config;

async function ensureBucketExists(
  s3: S3Client,
  bucket: string,
  region: string
) {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`Bucket "${bucket}" already exists.`);
  } catch (err: any) {
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
      console.log(`Bucket "${bucket}" not found. Creating bucket...`);
      const createParams =
        region === "us-east-1"
          ? { Bucket: bucket }
          : {
              Bucket: bucket,
              CreateBucketConfiguration: {
                LocationConstraint: region as BucketLocationConstraint,
              },
            };
      await s3.send(new CreateBucketCommand(createParams));
      console.log(`Bucket "${bucket}" created successfully.`);
    } else {
      console.error("Error checking/creating bucket:", err);
      throw err;
    }
  }
}

async function s3Connect() {
  try {
    const s3 = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        sessionToken: AWS_SESSION_TOKEN,
      },
    });
    await ensureBucketExists(s3, S3_BUCKET_NAME, AWS_REGION);
    return s3;
  } catch (error) {
    console.error("Failed to connect to S3:", error);
    throw error;
  }
}

export default s3Connect;
