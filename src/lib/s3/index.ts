import { CreateBucketCommand, GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { File } from '../types';

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

async function createBucket(client: S3Client, bucketName: string) {
    await client.send(new CreateBucketCommand({ Bucket: bucketName }));
}

export async function uploadFilesToS3(bucketName: string, files: File[]) {
    const client = createS3Client();
    await createBucket(client, bucketName).catch(() => console.log("Bucket already exists"));
    return Promise.all(
        files.map(f =>
            client.send(new PutObjectCommand({ Bucket: bucketName, Key: f.path, Body: f.content }))
        )
    ).finally(() => client.destroy());
}

export async function getFilesFromS3(bucketName: string) {
    const client = createS3Client();
    try {
        const { Contents = [] } = await client.send(new ListObjectsCommand({ Bucket: bucketName }));
        return await Promise.all(Contents.filter(f => f.Key).map(async (f) => {
            const res = await client.send(new GetObjectCommand({ Bucket: bucketName, Key: f.Key }));
            const content = await res.Body?.transformToString() ?? '';
            return { path: f.Key!, content };
        }));
    } catch {
        console.log('Bucket not found');
        return [];
    } finally {
        client.destroy();
    }
}