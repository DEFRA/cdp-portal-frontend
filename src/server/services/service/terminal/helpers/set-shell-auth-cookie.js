import { config } from '#config/config.js'
import { signShellAuthCookie } from './sign-shell-auth-cookie.js'

// Must match COOKIE_NAME in cdp-webshell-proxy src/user_auth.py
const shellAuthCookieName = 'cdpShellAuth'

/**
 * Registers the shell auth cookie's definition once, at startup.
 * The value is signed by us, not encoded by hapi, so webshell-proxy (Python) can verify it.
 * @param {import('@hapi/hapi').Server} server
 */
function registerShellAuthCookie(server) {
  const shellAuthCookieConfig = config.get('shellAuthCookie')

  server.state(shellAuthCookieName, {
    domain: shellAuthCookieConfig.domain ?? undefined,
    isSecure: shellAuthCookieConfig.isSecure,
    isHttpOnly: true,
    isSameSite: 'Lax',
    encoding: 'none',
    clearInvalid: true,
    strictHeader: true
  })
}

/**
 * Sets the signed cookie webshell-proxy uses to allow only the shell's owner through.
 * Scoped to the shell's token path, so each shell gets its own cookie.
 * Lives for the configured TTL, which should match the shell's max lifetime.
 */
function setShellAuthCookie(response, { oid, token }) {
  const shellAuthCookieConfig = config.get('shellAuthCookie')

  const ttl = shellAuthCookieConfig.ttl
  const cookieValue = signShellAuthCookie({
    oid,
    token,
    ttl,
    secret: shellAuthCookieConfig.secret
  })

  response.state(shellAuthCookieName, cookieValue, {
    path: `/${token}`,
    ttl
  })
}

export { registerShellAuthCookie, setShellAuthCookie, shellAuthCookieName }
