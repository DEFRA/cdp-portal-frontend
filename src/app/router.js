import inert from '@hapi/inert'
import { home } from '~/src/app/home'
import { deployments } from '~/src/app/deployments'
import { serveStaticFiles } from '~/src/common/helpers/serve-static-files'

const router = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register([inert])
      await server.register([home, deployments, serveStaticFiles])
    }
  }
}

export { router }
