import inert from '@hapi/inert'
import { health } from '~/src/server/health'
import { home } from '~/src/server/home'
import { createService } from '~/src/server/create-service'
import { deployService } from '~/src/server/deploy-service'
import { deployments } from '~/src/server/deployments'
import { runningServices } from '~/src/server/running-services'
import { services } from '~/src/server/services'
import { teams } from '~/src/server/teams'
import { utilities } from '~/src/server/utilities'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files'
import { admin } from '~/src/server/admin'

const router = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register([inert])
      await server.register([
        admin,
        health,
        home,
        createService,
        deployService,
        deployments,
        runningServices,
        services,
        teams,
        utilities,
        serveStaticFiles
      ])
    }
  }
}

export { router }
