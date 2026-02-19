import { createUrlSchema } from './packages/functions/src/features/urls/urls.schema'

const testCases = [
  'javascript:alert(1)',
  'vbscript:msgbox(1)',
  'data:text/html,<script>alert(1)</script>',
  'file:///etc/passwd',
  'https://169.254.169.254/latest/meta-data/', // AWS IMDS
  'http://[::1]:80',
  'https://google.com',
]

console.log('--- Testing Security Schemas ---')
for (const url of testCases) {
  const result = createUrlSchema.safeParse({ url })
  console.log(`URL: ${url}`)
  console.log(`Valid: ${result.success}`)
  if (!result.success) {
    console.log(`Error: ${result.error.issues[0].message}`)
  }
  console.log('---')
}
