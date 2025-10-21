import { streamObject, type ModelMessage } from 'ai'
import { getModelOptions } from '@/ai/config'
import { Deferred } from '@/lib/deferred'
import { CreateBucketCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { createS3Client } from '@/lib/s3'
import z from 'zod/v4'

export type File = z.infer<typeof fileSchema>

const fileSchema = z.object({
  path: z
    .string()
    .describe(
      "Path to the file in the Vercel Sandbox (relative paths from sandbox root, e.g., 'src/main.js', 'package.json', 'components/Button.tsx')"
    ),
  content: z
    .string()
    .describe(
      'The content of the file as a utf8 string (complete file contents that will replace any existing file at this path)'
    ),
})

interface Params {
  messages: ModelMessage[]
  paths: string[]
  projectId: string
}

export async function* getContents({ messages, paths, projectId }: Params): AsyncGenerator<File[]> {
  const deferred = new Deferred<void>()
  const result = streamObject({
    ...getModelOptions(),
    system:
      'You are a file content generator. You must generate files based on the conversation history and the provided paths. NEVER generate lock files (pnpm-lock.yaml, package-lock.json, yarn.lock) - these are automatically created by package managers.',
    messages: [
      ...messages,
      {
        role: 'user',
        content: `Generate the content of the following files according to the conversation: ${paths.map(
          (path) => `\n - ${path}`
        )}`,
      },
    ],
    schema: z.object({ files: z.array(fileSchema) }),
    onError: (error) => {
      deferred.reject(error)
      console.error('Error communicating with AI')
      console.error(JSON.stringify(error, null, 2))
    },
    onFinish: async ({ object }) => {
      const client = createS3Client();
      try {
        await client.send(new CreateBucketCommand({ Bucket: projectId }));
      } catch {
        console.error('Bucket already exists');
      }
      const promises = [];

      for (const file of (object?.files ?? [])) {
        if (!file.path || !file.content) {
          continue
        }
        const command = new PutObjectCommand({
          Bucket: projectId,
          Key: file.path,
          Body: file.content,
        });

        promises.push(client.send(command));
      }
      await Promise.all(promises);
      client.destroy();
    },
  })

  let generated = 0;

  for await (const items of result.partialObjectStream) {
    if (!Array.isArray(items?.files)) {
      continue
    }

    const files = items.files
      .slice(generated, items.files.length - 2)
      .map((file) => fileSchema.parse(file))

    yield files
    if (files.length > 0) {
      generated += files.length;
    }
  }

  const raceResult = await Promise.race([result.object, deferred.promise])
  if (!raceResult) {
    throw new Error('Unexpected Error: Deferred was resolved before the result')
  }

  const files = raceResult.files.slice(generated)
  if (files.length > 0) {
    yield files
    generated += files.length;
  }
}
