import { NextResponse, type NextRequest } from 'next/server'
import { createS3Client } from '@/lib/s3'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import z from 'zod/v4'

const FileParamsSchema = z.object({
  bucketId: z.string(),
  path: z.string(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bucketId: string }> }
) {
  const { bucketId } = await params
  const fileParams = FileParamsSchema.safeParse({
    path: request.nextUrl.searchParams.get('path'),
    bucketId,
  })

  if (fileParams.success === false) {
    return NextResponse.json(
      { error: 'Invalid parameters. You must pass a `path` as query' },
      { status: 400 }
    )
  }

  try {
    const client = createS3Client();
    const command = new GetObjectCommand({
      Bucket: fileParams.data.bucketId,
      Key: fileParams.data.path,
    });
    const data = await client.send(command);
    const stream = data.Body?.transformToWebStream();

    return new NextResponse(stream)
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }
}
