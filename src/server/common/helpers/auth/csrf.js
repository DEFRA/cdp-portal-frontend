import crumb from '@hapi/crumb'

import { config } from '../../../../config/config.js'

const sessionCookieConfig = config.get('session.cookie')

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
