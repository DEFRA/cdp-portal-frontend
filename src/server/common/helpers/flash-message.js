import yar from '@hapi/yar'
import { appConfig } from '~/src/config'

const flashMessage = {
  plugin: yar,
  options: {
    name: 'cdp-portal-frontend',
    maxCookieSize: 0, // Always use server-side storage
    cache: { cache: 'session' },
    storeBlank: false,
    errorOnCacheNotReady: true,
    cookieOptions: {
      password: appConfig.get('sessionCookiePassword'),
      isSecure: true
    }
  }
}

export { flashMessage }
