
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadBufferToS3(
  fileBuffer,
  fileName,
  contentType
) {
  try {
    if (!Buffer.isBuffer(fileBuffer)) {
      throw new Error("Invalid file buffer");
    }

    if (!fileBuffer.length) {
      throw new Error("File buffer is empty");
    }

    const bucket = process.env.AWS_BUCKET_NAME;

    if (!bucket) {
      throw new Error("AWS bucket name is missing");
    }

    const uploadParams = {
      Bucket: bucket,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
      ContentLength: fileBuffer.length,
    };

    await s3Client.send(
      new PutObjectCommand(uploadParams)
    );

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: fileName,
    });

    const presignedUrl = await getSignedUrl(
      s3Client,
      command,
      {
        expiresIn: 3600,
      }
    );

    return presignedUrl;

  } catch (err) {
    console.error("S3 Upload Error:", {
      name: err.name,
      message: err.message,
      code: err.Code,
      statusCode: err.$metadata?.httpStatusCode,
      requestId: err.$metadata?.requestId,
    });

    throw err;
  }
}
