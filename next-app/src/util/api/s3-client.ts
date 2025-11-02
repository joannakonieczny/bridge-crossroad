"server-only";

import { config } from "@/util/envConfigLoader";
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    sessionToken: config.AWS_SESSION_TOKEN,
  },
});
