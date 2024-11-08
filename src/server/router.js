import inert from '@hapi/inert'

import { admin } from '~/src/server/admin/index.js'
import { auth } from '~/src/server/auth/index.js'
import { cookies } from '~/src/server/cookies/index.js'
import { create } from '~/src/server/create/index.js'
import { deployService } from '~/src/server/deploy-service/index.js'
import { deployments } from '~/src/server/deployments/index.js'
import { documentation } from '~/src/server/documentation/index.js'
import { health } from '~/src/server/health/index.js'
import { help } from '~/src/server/help/index.js'
import { home } from '~/src/server/home/index.js'
import { login } from '~/src/server/login/index.js'
import { logout } from '~/src/server/logout/index.js'
import { runningServices } from '~/src/server/running-services/index.js'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files.js'
import { services } from '~/src/server/services/index.js'
import { teams } from '~/src/server/teams/index.js'
import { testSuites } from '~/src/server/test-suites/index.js'

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
        help,
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
