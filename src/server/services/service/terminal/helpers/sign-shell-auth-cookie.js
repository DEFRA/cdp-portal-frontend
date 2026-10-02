import { createHmac } from 'node:crypto'

function encode(value) {
  return Buffer.from(value).toString('base64url')
}

export function signShellAuthCookie({
  oid,
  token,
  ttlSeconds,
  secret,
  nowEpochSeconds = Math.floor(Date.now() / 1000)
}) {
  const exp = nowEpochSeconds + ttlSeconds
  const payload = encode(JSON.stringify({ oid, token, exp }))
  const signature = createHmac('sha256', secret)
    .update(payload)
    .digest('base64url')
  return `${payload}.${signature}`
}
