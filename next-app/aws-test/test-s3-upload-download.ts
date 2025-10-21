import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import type { BucketLocationConstraint } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { config } from "@/util/envConfigLoader";

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN,
  AWS_REGION,
  S3_BUCKET_NAME,
} = config;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureBucketExists(
  s3: S3Client,
  bucket: string,
  region: string
) {
  try {
    await s3.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`✅ Bucket "${bucket}" already exists.`);
  } catch (err: any) {
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
      console.log(`🪣  Bucket "${bucket}" not found. Creating it...`);

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
      console.log(`✅ Bucket "${bucket}" created successfully.`);
    } else {
      console.error("❌ Error checking/creating bucket:", err);
      throw err;
    }
  }
}

async function cleanup(
  s3: S3Client,
  bucket: string,
  key: string,
  deleteBucket = false
) {
  console.log("🧹 Cleaning up S3 resources...");

  // Delete object
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  console.log(`🗑️  Deleted object: s3://${bucket}/${key}`);

  if (deleteBucket) {
    // List remaining objects (just in case)
    const list = await s3.send(new ListObjectsV2Command({ Bucket: bucket }));
    if (list.Contents && list.Contents.length > 0) {
      console.log(
        `⚠️ Bucket "${bucket}" is not empty; deleting remaining objects...`
      );
      for (const obj of list.Contents) {
        if (obj.Key) {
          await s3.send(
            new DeleteObjectCommand({ Bucket: bucket, Key: obj.Key })
          );
        }
      }
    }

    // Delete the bucket
    await s3.send(new DeleteBucketCommand({ Bucket: bucket }));
    console.log(`🗑️  Deleted bucket: ${bucket}`);
  }

  console.log("✅ Cleanup complete.");
}

async function uploadFile(
  s3: S3Client,
  bucket: string,
  key: string,
  filePath: string
) {
  console.log("📤 Uploading file to S3...");

  const fileContent = fs.readFileSync(filePath);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileContent,
    ContentType: "text/plain",
  });

  await s3.send(command);
  console.log(`✅ File uploaded successfully to s3://${bucket}/${key}`);
}

async function downloadFile(
  s3: S3Client,
  bucket: string,
  key: string,
  outputPath: string
) {
  console.log("📥 Generating signed URL for download...");

  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  console.log("🔗 Signed download URL:", signedUrl);

  // Download content directly
  const { Body } = await s3.send(command);
  const stream = Body as NodeJS.ReadableStream;
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  const fileBuffer = Buffer.concat(chunks);
  fs.writeFileSync(outputPath, fileBuffer);

  console.log(`✅ File downloaded and saved locally as ${outputPath}`);
}

async function main() {
  if (
    !AWS_ACCESS_KEY_ID ||
    !AWS_SECRET_ACCESS_KEY ||
    !AWS_SESSION_TOKEN ||
    !AWS_REGION ||
    !S3_BUCKET_NAME
  ) {
    console.error("❌ Missing one or more required environment variables:");
    console.error({
      AWS_ACCESS_KEY_ID: !!AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: !!AWS_SECRET_ACCESS_KEY,
      AWS_REGION: !!AWS_REGION,
      S3_BUCKET_NAME: !!S3_BUCKET_NAME,
    });
    process.exit(1);
  }

  console.log("✅ Environment loaded successfully");
  console.log(`➡️  Region: ${AWS_REGION}`);
  console.log(`➡️  Bucket: ${S3_BUCKET_NAME}`);

  // Initialize AWS S3 client
  const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      sessionToken: AWS_SESSION_TOKEN,
    },
  });

  await ensureBucketExists(s3, S3_BUCKET_NAME, AWS_REGION);

  // File setup
  const filePath = path.join(__dirname, "test-upload.txt");
  const key = "test-folder/test-upload.txt";
  const downloadPath = path.join(__dirname, "downloaded.txt");

  fs.writeFileSync(filePath, "Hello from TypeScript S3 test!");

  // Run test
  await uploadFile(s3, S3_BUCKET_NAME, key, filePath);
  await downloadFile(s3, S3_BUCKET_NAME, key, downloadPath);

  console.log("🎉 Test completed successfully!");

  // Cleanup
  // await cleanup(s3, S3_BUCKET_NAME, key, true);
}

// Run the script
main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
