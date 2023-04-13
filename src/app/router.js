import inert from '@hapi/inert'
import { home } from '~/src/app/home/routes'
import { deployments } from '~/src/app/deployments/routes'
import { serveStaticFiles } from '~/src/common/helpers/serve-static-files'
import { config } from '~/src/config'

const router = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register(inert)
      server.realm.modifiers.route.prefix = config.get('appPathPrefix')

      server.route([home, deployments, serveStaticFiles])
    }
  }
}

export { router }
