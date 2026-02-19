import { describe, expect, it } from 'vitest'
import { generateShortCode } from '../../packages/core/src/shortCode'

describe('generateShortCode', () => {
  it('generates a code of default length (6)', () => {
    const code = generateShortCode()
    expect(code).toHaveLength(6)
  })

  it('generates a code of custom length', () => {
    const code = generateShortCode(10)
    expect(code).toHaveLength(10)
  })

  it('only contains URL-safe alphanumeric characters', () => {
    const validChars = /^[A-Za-z0-9]+$/
    for (let i = 0; i < 100; i++) {
      const code = generateShortCode()
      expect(code).toMatch(validChars)
    }
  })

  it('generates unique codes (low collision probability)', () => {
    const codes = new Set<string>()
    for (let i = 0; i < 1000; i++) {
      codes.add(generateShortCode())
    }
    // With 62^6 possible codes, 1000 should all be unique
    expect(codes.size).toBe(1000)
  })
})
