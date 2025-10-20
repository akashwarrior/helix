import { S3Client } from '@aws-sdk/client-s3';

export function createS3Client() {
    return new S3Client({
        forcePathStyle: true,
        region: process.env.AWS_REGION!,
        endpoint: process.env.AWS_ENDPOINT!,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        }
    })
}