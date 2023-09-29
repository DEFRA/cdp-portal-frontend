import yar from '@hapi/yar'
import { config } from '~/src/config'

const sessionManager = {
  plugin: yar,
  options: {
    name: 'cdp-portal-session',
    maxCookieSize: 0, // Always use server-side storage
    cache: { cache: 'session' },
    storeBlank: false,
    errorOnCacheNotReady: true,
    cookieOptions: {
      password: config.get('sessionCookiePassword'),
      isSecure: config.get('isProduction')
    }
  }
}

export { sessionManager }
