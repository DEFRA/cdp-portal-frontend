import { cookiePolicy } from './controllers/cookie-policy.js'
import { accessibilityStatement } from './controllers/accessibility-statement.js'

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
