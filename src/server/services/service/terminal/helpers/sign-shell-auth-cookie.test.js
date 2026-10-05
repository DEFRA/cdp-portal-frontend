import { createHmac } from 'node:crypto'

import { signShellAuthCookie } from './sign-shell-auth-cookie.js'

function decodePayload(cookieValue) {
  const [payload] = cookieValue.split('.')
  return JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'))
}

describe('#signShellAuthCookie', () => {
  test('signs oid token and expiry in base64url payload', () => {
    const cookieValue = signShellAuthCookie({
      oid: 'oid-1',
      token: 'token-1',
      ttl: 300 * 1000,
      secret: 'my-secret',
      nowEpochSeconds: 1000
    })

    const [payload, signature] = cookieValue.split('.')
    const decoded = decodePayload(cookieValue)

    expect(decoded).toEqual({ oid: 'oid-1', token: 'token-1', exp: 1300 })
    const expectedSignature = createHmac('sha256', 'my-secret')
      .update(payload)
      .digest('base64url')
    expect(signature).toBe(expectedSignature)
  })
})
