import z from 'zod/v4'

export const errorSchema = z.object({
  message: z.string(),
})

export const dataPartSchema = z.object({
  'project-name': z.object({
    name: z.string(),
  }),
  'generating-files': z.object({
    files: z.array(z.object({
      path: z.string(),
      status: z.enum(['generating', 'done', 'error']),
      content: z.string(),
    })),
    sandboxId: z.string().optional(),
    url: z.string().optional(),
    error: errorSchema.optional(),
  }),
  'run-command': z.object({
    commandId: z.string().optional(),
    command: z.string(),
    args: z.array(z.string()),
    status: z.enum(['executing', 'running', 'waiting', 'done', 'error']),
    exitCode: z.number().optional(),
    error: errorSchema.optional(),
  })
})

export type DataPart = z.infer<typeof dataPartSchema>
