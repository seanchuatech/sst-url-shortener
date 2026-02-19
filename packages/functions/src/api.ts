import { AppError } from '@sst-url-shortener/core/errors'
import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'
import { cors } from 'hono/cors'
import { urlRouter } from './features/urls/urls.router'
import { logger, withRequestLogger } from './logger'

import type { LambdaContext, LambdaEvent } from 'hono/aws-lambda'

type Bindings = {
  event: LambdaEvent
  context: LambdaContext
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use(cors())
app.use(async (c, next) => {
  // Attach logger to context if we wanted, but we have global logger
  withRequestLogger(c.env?.event, c.env?.context) // initialize for pino-lambda
  await next()
})

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Mount URL routes under /api
app.route('/api', urlRouter)

// Global error handler
app.onError((err, c) => {
  if (err instanceof AppError) {
    logger.warn({ err }, 'App Error handled')
    return c.json(
      {
        error: err.code,
        message: err.message,
      },
      err.statusCode as 400 | 404 | 409 | 500,
    )
  }

  // Unexpected errors
  logger.error({ err }, 'Unexpected error occurred')

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
