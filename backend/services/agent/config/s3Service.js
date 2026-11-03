import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadBufferToS3(fileBuffer, fileName, contentType) {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));

    const command = new GetObjectCommand({ Bucket: process.env.AWS_BUCKET_NAME, Key: fileName });
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return presignedUrl;

  } catch (err) {
    console.error("Error uploading buffer to S3:", err);
    throw err;
  }
}