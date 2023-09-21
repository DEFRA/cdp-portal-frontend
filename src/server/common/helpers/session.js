import yar from '@hapi/yar'
import { appConfig } from '~/src/config'

const session = {
  plugin: yar,
  options: {
    name: 'cdp-portal',
    storeBlank: false,
    errorOnCacheNotReady: true,
    cookieOptions: {
      password: appConfig.get('sessionCookiePassword'),
      isSecure: true
    }
  }
}

export { session }
