import { describe, expect, it } from 'vitest'
import { createUrlSchema } from '../../packages/functions/src/features/urls/urls.schema'

describe('createUrlSchema', () => {
  it('validates a correct URL', () => {
    const result = createUrlSchema.safeParse({ url: 'https://example.com' })
    expect(result.success).toBe(true)
  })

  it('validates URL with path and query params', () => {
    const result = createUrlSchema.safeParse({
      url: 'https://example.com/path?key=value&other=123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid URL', () => {
    const result = createUrlSchema.safeParse({ url: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('rejects missing url field', () => {
    const result = createUrlSchema.safeParse({})
    expect(result.success).toBe(false)
  })

  it('rejects empty string', () => {
    const result = createUrlSchema.safeParse({ url: '' })
    expect(result.success).toBe(false)
  })

  it('rejects URL exceeding 2048 characters', () => {
    const longUrl = `https://example.com/${'a'.repeat(2048)}`
    const result = createUrlSchema.safeParse({ url: longUrl })
    expect(result.success).toBe(false)
  })
  it('validates URL with expiresIn', () => {
    const result = createUrlSchema.safeParse({
      url: 'https://example.com',
      expiresIn: 3600,
    })
    expect(result.success).toBe(true)
  })

  it('rejects localhost', () => {
    const result = createUrlSchema.safeParse({ url: 'http://localhost:3000' })
    expect(result.success).toBe(false)
  })

  it('rejects negative expiresIn', () => {
    const result = createUrlSchema.safeParse({
      url: 'https://example.com',
      expiresIn: -1,
    })
    expect(result.success).toBe(false)
  })
})
