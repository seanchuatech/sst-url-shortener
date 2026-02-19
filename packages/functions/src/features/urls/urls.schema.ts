import { z } from 'zod'

export const createUrlSchema = z.object({
  url: z
    .string()
    .url('Must be a valid URL')
    .startsWith('http', 'URL must start with http or https')
    .max(2048, 'URL must be 2048 characters or less')
    .refine(
      (val) => {
        try {
          const url = new URL(val)
          const forbiddenHosts = ['localhost', '127.0.0.1', '169.254.169.254', '[::1]']
          return !forbiddenHosts.includes(url.hostname)
        } catch {
          return false
        }
      },
      {
        message: 'Invalid or restricted URL host',
      },
    ),
  expiresIn: z.number().int().positive().optional(),
})

export type CreateUrlInput = z.infer<typeof createUrlSchema>
