import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import type { Sandbox } from '@vercel/sandbox'
import { getContents } from './generate-files/get-contents'
import { getRichError } from './get-rich-error'
import { getWriteFiles } from './generate-files/get-write-files'
import { createSandbox } from '../config'
import description from './generate-files.md'
import { tool } from 'ai'
import z from 'zod/v4'

interface Params {
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
  projectId: string
}

export const generateFiles = ({ writer, projectId }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      paths: z.array(z.string()).min(1),
    }),
    execute: async ({ paths }, { toolCallId, messages }) => {
      const files: DataPart['generating-files']['files'] = paths.map(
        (path) => ({ path, content: '', status: 'generating' })
      );

      writer.write({ id: toolCallId, type: 'data-generating-files', data: { files } })

      let sandbox: Sandbox | null = null;

      try {
        sandbox = await createSandbox(projectId);
      } catch (error) {
        const richError = getRichError({
          action: 'get sandbox id',
          error,
        })

        writer.write({
          id: toolCallId,
          type: 'data-generating-files',
          data: { error: richError.error, files: files.map((file) => ({ ...file, status: 'error' })) },
        })

        console.log('error in generate files', richError.message);
        return richError.message
      }

      const writeFiles = getWriteFiles({ sandbox, toolCallId, writer })
      const iterator = getContents({ messages, paths, projectId })

      writer.write({ id: toolCallId, type: 'data-generating-files', data: { files, sandboxId: sandbox.sandboxId } })

      try {
        for await (const chunk of iterator) {
          if (chunk.length > 0) {
            const error = await writeFiles(chunk)
            if (error) {
              return error
            } else {
              files.forEach((file) => {
                const chunkFile = chunk.find((f) => f.path === file.path);
                if (chunkFile) {
                  file.content = chunkFile.content;
                  file.status = 'done';
                }
              });
              writer.write({ id: toolCallId, type: 'data-generating-files', data: { files } })
            }
          }
        }
      } catch (error) {
        const richError = getRichError({
          action: 'generate file contents',
          args: { paths },
          error,
        })

        writer.write({
          id: toolCallId,
          type: 'data-generating-files',
          data: {
            error: richError.error,
            files: paths.map((path) => ({ path, content: '', status: 'error' })),
          },
        })

        return richError.message
      }

      return `Successfully generated and uploaded ${files.length} files.`
    },
  })
