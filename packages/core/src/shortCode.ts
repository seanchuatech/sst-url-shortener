import { randomBytes } from 'node:crypto'

const URL_SAFE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const DEFAULT_LENGTH = 6

/**
 * Generates a cryptographically random short code.
 * Uses Node.js crypto for secure randomness (no Math.random).
 *
 * @param length - Length of the generated code (default: 6)
 * @returns A URL-safe alphanumeric string
 */
export const generateShortCode = (length: number = DEFAULT_LENGTH): string => {
  const bytes = randomBytes(length)
  let result = ''

  for (let i = 0; i < length; i++) {
    result += URL_SAFE_CHARS[bytes[i] % URL_SAFE_CHARS.length]
  }

  return result
}
