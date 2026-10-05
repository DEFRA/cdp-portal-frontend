import { createHmac } from 'node:crypto'

function encode(value) {
  return Buffer.from(value).toString('base64url')
}

export function signShellAuthCookie({
  oid,
  token,
  ttl,
  secret,
  nowEpochSeconds = Math.floor(Date.now() / 1000)
}) {
  // ttl is in milliseconds, exp is epoch seconds as webshell-proxy compares it to time.time()
  const exp = nowEpochSeconds + Math.floor(ttl / 1000)
  const payload = encode(JSON.stringify({ oid, token, exp }))
  const signature = createHmac('sha256', secret)
    .update(payload)
    .digest('base64url')
  return `${payload}.${signature}`
}
