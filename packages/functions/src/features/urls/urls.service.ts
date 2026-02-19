import { getUrl, incrementClicks, putUrl } from '@sst-url-shortener/core/dynamo'
import { ConflictError, NotFoundError } from '@sst-url-shortener/core/errors'
import { generateShortCode } from '@sst-url-shortener/core/shortCode'
import type { CreateUrlInput } from './urls.schema'

const MAX_RETRIES = 3

export const createShortUrl = async (input: CreateUrlInput) => {
  let attempts = 0

  while (attempts < MAX_RETRIES) {
    const shortCode = generateShortCode()
    const now = new Date().toISOString()
    const expiresAt = input.expiresIn ? Math.floor(Date.now() / 1000) + input.expiresIn : undefined

    try {
      await putUrl({
        shortCode,
        longUrl: input.url,
        createdAt: now,
        clicks: 0,
        expiresAt,
      })

      return {
        shortCode,
        longUrl: input.url,
        createdAt: now,
        expiresAt,
      }
    } catch (error: unknown) {
      // DynamoDB ConditionalCheckFailedException = code collision, retry
      if (error instanceof Error && error.name === 'ConditionalCheckFailedException') {
        attempts++
        continue
      }
      throw error
    }
  }

  throw new ConflictError('Failed to generate unique short code after retries')
}

export const resolveShortUrl = async (shortCode: string) => {
  const record = await getUrl(shortCode)

  if (!record) {
    throw new NotFoundError(`Short URL '${shortCode}' not found`)
  }

  // Check Expiration
  // record.expiresAt is in seconds. Date.now() is milliseconds.
  if (record.expiresAt && record.expiresAt < Math.floor(Date.now() / 1000)) {
    throw new NotFoundError(`Short URL '${shortCode}' has expired`)
  }

  // Fire-and-forget: increment clicks asynchronously
  incrementClicks(shortCode).catch(() => {
    // Swallow click tracking errors — redirect is more important
  })

  return record
}

export const getUrlStats = async (shortCode: string) => {
  const record = await getUrl(shortCode)

  if (!record) {
    throw new NotFoundError(`Short URL '${shortCode}' not found`)
  }

  return {
    shortCode: record.shortCode,
    longUrl: record.longUrl,
    clicks: record.clicks,
    createdAt: record.createdAt,
    expiresAt: record.expiresAt,
  }
}
