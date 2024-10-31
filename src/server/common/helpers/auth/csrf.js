import crumb from '@hapi/crumb'

import { config } from '~/src/config/index.js'

const csrf = {
  plugin: {
    name: 'csrf',
    ...crumb
  },
  options: {
    key: 'csrfToken',
    cookieOptions: {
      path: '/',
      password: config.get('sessionCookiePassword'),
      isSecure: config.get('isProduction'),
      ttl: config.get('sessionCookieTtl')
    }
  }
}

export { csrf }
