import {
  accessibilityStatement,
  cookiePolicy
} from '~/src/server/help/controllers/index.js'

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
