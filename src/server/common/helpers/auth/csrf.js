import crumb from '@hapi/crumb'

import { config } from '~/src/config/index.js'

const sessionCookieConfig = config.get('sessionCookie')

const csrf = {
  plugin: {
    name: 'csrf',
    ...crumb
  },
  options: {
    key: 'csrfToken',
    cookieOptions: {
      path: '/',
      password: sessionCookieConfig.password,
      isSecure: sessionCookieConfig.isSecure,
      ttl: sessionCookieConfig.ttl
    }
  }
}

export { csrf }
