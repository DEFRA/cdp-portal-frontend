import yar from '@hapi/yar'
import { appConfig } from '~/src/config'

const sessionManager = {
  plugin: yar,
  options: {
    name: 'cdp-portal-session',
    maxCookieSize: 0, // Always use server-side storage
    cache: { cache: 'session' },
    storeBlank: false,
    errorOnCacheNotReady: true,
    cookieOptions: {
      password: appConfig.get('sessionCookiePassword'),
      isSecure: appConfig.get('isProduction')
    }
  }
}

export { sessionManager }
