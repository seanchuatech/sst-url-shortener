import { z } from 'zod'

export const createUrlSchema = z.object({
  url: z.string().url('Must be a valid URL').max(2048, 'URL must be 2048 characters or less'),
})

export type CreateUrlInput = z.infer<typeof createUrlSchema>
