import inert from '@hapi/inert'

import { health } from '~/src/server/health'
import { auth } from '~/src/server/auth'
import { admin } from '~/src/server/admin'
import { home } from '~/src/server/home'
import { create } from '~/src/server/create'
import { deployService } from '~/src/server/deploy-service'
import { deployments } from '~/src/server/deployments'
import { runningServices } from '~/src/server/running-services'
import { services } from '~/src/server/services'
import { teams } from '~/src/server/teams'
import { utilities } from '~/src/server/utilities'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files'
import { login } from '~/src/server/login'
import { logout } from '~/src/server/logout'
import { testSuites } from '~/src/server/test-suites'
import { cookies } from '~/src/server/cookies'

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
        health,
        home,
        login,
        logout,
        runningServices,
        serveStaticFiles,
        services,
        teams,
        testSuites,
        utilities
      ])
    }
  }
}

export { router }
