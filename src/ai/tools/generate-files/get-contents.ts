import { streamObject, type ModelMessage } from 'ai'
import { getModelOptions } from '@/ai/config'
import { Deferred } from '@/lib/deferred'
import prompt from './get-contents.md'
import z from 'zod/v4'

export type File = z.infer<typeof fileSchema>

const fileSchema = z.object({
  path: z
    .string()
    .describe(
      "Path to the file in the Sandbox (relative paths from sandbox root, e.g., 'src/main.js', 'package.json', 'components/Button.tsx')"
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
}

export async function* getContents({ messages, paths }: Params): AsyncGenerator<File[]> {
  const deferred = new Deferred<void>()
  const result = streamObject({
    ...getModelOptions(),
    system: prompt,

    // TODO: instead of all messages, only send the last user message and let it decide what to generate/update
    messages: [
      ...messages,
      {
        role: 'user',
        content: `Generate the content of the following files according to the conversation: ${paths.map(
          (path) => `\n - ${path}`
        )}`,
      },
    ],

    // TODO: add git patches so it can generate files based on the changes in the codebase without overwhelming the context window
    schema: z.object({ files: z.array(fileSchema) }),
    onError: (error) => {
      deferred.reject(error)
      console.error('Error communicating with AI')
      console.error(JSON.stringify(error, null, 2))
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
