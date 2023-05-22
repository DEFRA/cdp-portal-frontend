import inert from '@hapi/inert'
import { health } from '~/src/app/health'
import { home } from '~/src/app/home'
import { createService } from '~/src/app/create-service'
import { deployService } from '~/src/app/deploy-service'
import { deployments } from '~/src/app/deployments'
import { runningServices } from '~/src/app/running-services'
import { services } from '~/src/app/services'
import { teams } from '~/src/app/teams'
import { serveStaticFiles } from '~/src/common/helpers/serve-static-files'

const router = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register([inert])
      await server.register([
        health,
        home,
        createService,
        deployService,
        deployments,
        runningServices,
        services,
        teams,
        serveStaticFiles
      ])
    }
  }
}

export { router }
