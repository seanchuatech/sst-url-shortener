import { Hono } from 'hono'
import { createUrlSchema } from './urls.schema'
import { createShortUrl, getUrlStats, resolveShortUrl } from './urls.service'

export const urlRouter = new Hono()

/**
 * POST /shorten - Create a short URL
 */
urlRouter.post('/shorten', async (c) => {
  const body = await c.req.json()
  const parsed = createUrlSchema.safeParse(body)

  if (!parsed.success) {
    return c.json(
      {
        error: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: parsed.error.issues,
      },
      400,
    )
  }

  const result = await createShortUrl(parsed.data)

  return c.json(result, 201)
})

/**
 * GET /stats/:code - Get click stats for a URL
 */
urlRouter.get('/stats/:code', async (c) => {
  const { code } = c.req.param()
  const stats = await getUrlStats(code)
  return c.json(stats)
})

/**
 * GET /:code - Redirect to original URL
 */
urlRouter.get('/:code', async (c) => {
  const { code } = c.req.param()
  const record = await resolveShortUrl(code)
  return c.redirect(record.longUrl, 302)
})
