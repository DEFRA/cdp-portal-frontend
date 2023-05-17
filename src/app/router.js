import inert from '@hapi/inert'
import { health } from '~/src/app/health'
import { home } from '~/src/app/home'
import { createService } from '~/src/app/create-service'
import { deployService } from '~/src/app/deploy-service'
import { deployedServices } from '~/src/app/deployed-services'
import { runningServices } from '~/src/app/running-services'
import { services } from '~/src/app/services'
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
        deployedServices,
        runningServices,
        services,
        serveStaticFiles
      ])
    }
  }
}

export { router }
