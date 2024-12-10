import { cookiePolicy } from '~/src/server/help/controllers/cookie-policy.js'
import { accessibilityStatement } from '~/src/server/help/controllers/accessibility-statement.js'

const help = {
  plugin: {
    name: 'help',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/help/accessibility-statement',
          ...accessibilityStatement
        },
        {
          method: 'GET',
          path: '/help/cookie-policy',
          ...cookiePolicy
        }
      ])
    }
  }
}

export { help }
