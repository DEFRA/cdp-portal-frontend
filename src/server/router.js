import inert from '@hapi/inert'

import { admin } from '~/src/server/admin'
import { auth } from '~/src/server/auth'
import { cookies } from '~/src/server/cookies'
import { create } from '~/src/server/create'
import { deployService } from '~/src/server/deploy-service'
import { deployments } from '~/src/server/deployments'
import { documentation } from '~/src/server/documentation'
import { health } from '~/src/server/health'
import { home } from '~/src/server/home'
import { login } from '~/src/server/login'
import { logout } from '~/src/server/logout'
import { runningServices } from '~/src/server/running-services'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files'
import { services } from '~/src/server/services'
import { teams } from '~/src/server/teams'
import { testSuites } from '~/src/server/test-suites'

const router = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register([inert])
      await server.register([
        admin,
        auth,
        cookies,
        create,
        deployService,
        deployments,
        documentation,
        health,
        home,
        login,
        logout,
        runningServices,
        serveStaticFiles,
        services,
        teams,
        testSuites
      ])
    }
  }
}

export { router }
