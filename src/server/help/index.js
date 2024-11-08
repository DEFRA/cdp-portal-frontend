import { accessibilityStatement } from '~/src/server/help/controllers/index.js'

const help = {
  plugin: {
    name: 'help',
    register: (server) => {
      server.route({
        method: 'GET',
        path: '/help/accessibility-statement',
        ...accessibilityStatement
      })
    }
  }
}

export { help }
