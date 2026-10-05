import { config } from '#config/config.js'

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

export { registerShellAuthCookie, shellAuthCookieName }
