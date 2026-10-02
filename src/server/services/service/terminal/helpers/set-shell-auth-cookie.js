import { environments } from '@defra/cdp-validation-kit'

import { config } from '#config/config.js'
import { signShellAuthCookie } from './sign-shell-auth-cookie.js'

// Must match COOKIE_NAME in cdp-webshell-proxy src/user_auth.py
const shellAuthCookieName = 'cdpTerminalAuth'

function getTtlSeconds(environment, shellAuthCookieConfig) {
  const terminalTtlSeconds =
    environment === environments.prod
      ? shellAuthCookieConfig.prodTtlSeconds
      : shellAuthCookieConfig.ttlSeconds
  const sessionTtlSeconds = Math.floor(config.get('session.cookie.ttl') / 1000)

  return Math.min(terminalTtlSeconds, sessionTtlSeconds)
}

/**
 * Sets the signed cookie webshell-proxy uses to allow only the shell's owner through.
 * Scoped to the shell's token path, so each shell gets its own cookie.
 */
function setShellAuthCookie(response, { oid, token, environment }) {
  const shellAuthCookieConfig = config.get('shellAuthCookie')

  if (!shellAuthCookieConfig.enabled) {
    return
  }

  const ttlSeconds = getTtlSeconds(environment, shellAuthCookieConfig)
  const cookieValue = signShellAuthCookie({
    oid,
    token,
    ttlSeconds,
    secret: shellAuthCookieConfig.secret
  })

  response.state(shellAuthCookieName, cookieValue, {
    path: `/${token}`,
    domain: shellAuthCookieConfig.domain ?? undefined,
    ttl: ttlSeconds * 1000,
    isSecure: shellAuthCookieConfig.isSecure,
    isHttpOnly: true,
    isSameSite: 'Lax',
    encoding: 'none',
    clearInvalid: true,
    strictHeader: true
  })
}

export { setShellAuthCookie, shellAuthCookieName }
