import yar from '@hapi/yar'
import { config } from '~/src/config/config.js'

const sessionCookieConfig = config.get('sessionCookie')

const sessionManager = {
  plugin: yar,
  options: {
    name: 'cdpPortalSession',
    maxCookieSize: 0, // Always use server-side storage
    cache: { cache: 'session' },
    storeBlank: false,
    errorOnCacheNotReady: true,
    cookieOptions: {
      password: sessionCookieConfig.password,
      isSecure: sessionCookieConfig.isSecure,
      ttl: sessionCookieConfig.ttl
    }
  }
}

export { sessionManager }
