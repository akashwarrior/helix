import type { UIMessageStreamWriter, UIMessage } from 'ai'
import type { DataPart } from '../messages/data-parts'
import description from './get-sandbox-url.md'
import { createSandbox } from '../config'
import { tool } from 'ai'
import z from 'zod/v4'

interface Params {
  projectId: string
  writer: UIMessageStreamWriter<UIMessage<never, DataPart>>
}

export const getSandboxURL = ({ writer, projectId }: Params) =>
  tool({
    description,
    inputSchema: z.object({
      port: z
        .number()
        .describe(
          'The port number where a service is running e.g., 3000 for Next.js dev server, 8000 for Python apps, 5000 for Flask).'
        ),
    }),
    execute: async ({ port }, { toolCallId }) => {
      writer.write({
        id: toolCallId,
        type: 'data-get-sandbox-url',
        data: { status: 'loading' },
      })

      const sandbox = await createSandbox(projectId);
      const url = sandbox.domain(port);

      if (!url) {
        writer.write({
          id: toolCallId,
          type: 'data-get-sandbox-url',
          data: { url: undefined, status: 'done' },
        })
        return 'error getting sandbox url';
      }

      writer.write({
        id: toolCallId,
        type: 'data-get-sandbox-url',
        data: { url, status: 'done' },
      })

      return { url }
    },
  })
