import { AppError } from '@sst-url-shortener/core/errors'
import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { urlRouter } from './features/urls/urls.router'

const app = new Hono()

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Mount URL routes under /api
app.route('/api', urlRouter)

// Global error handler
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json(
      {
        error: err.code,
        message: err.message,
      },
      err.statusCode as 400 | 404 | 409 | 500,
    )
  }

  // Unexpected errors
  console.error(
    JSON.stringify({
      level: 'error',
      message: err.message,
      stack: err.stack,
    }),
  )

  return c.json(
    {
      error: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
    500,
  )
})

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      error: 'NOT_FOUND',
      message: `Route ${c.req.method} ${c.req.path} not found`,
    },
    404,
  )
})

export const handler = handle(app)
