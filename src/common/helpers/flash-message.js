import yar from '@hapi/yar'
import { appConfig } from '~/src/config'

const flashMessage = {
  plugin: yar,
  options: {
    storeBlank: false,
    cookieOptions: {
      password: appConfig.get('sessionCookiePassword'),
      isSecure: true
    }
  }
}

export { flashMessage }
