import yar from '@hapi/yar'
import { config } from '~/src/config/index.js'

const sessionManager = {
  plugin: yar,
  options: {
    name: 'cdpPortalSession',
    maxCookieSize: 0, // Always use server-side storage
    cache: { cache: 'session' },
    storeBlank: false,
    errorOnCacheNotReady: true,
    cookieOptions: {
      password: config.get('sessionCookiePassword'),
      isSecure: config.get('isProduction'),
      ttl: config.get('sessionCookieTtl')
    }
  }
}

export { sessionManager }
