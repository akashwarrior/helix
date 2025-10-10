import z from 'zod/v4'

export const metadataSchema = z.object({
  model: z.string(),
})

export type Metadata = z.infer<typeof metadataSchema>