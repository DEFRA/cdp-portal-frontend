import inert from '@hapi/inert'

import { admin } from './admin/routes.js'
import { applyChangelog } from './apply-changelog/routes.js'
import { auth } from './auth/index.js'
import { create } from './create/routes.js'
import { deployService } from './deploy-service/routes.js'
import { deployments } from './deployments/routes.js'
import { documentation } from './documentation/routes.js'
import { health } from './health/routes.js'
import { help } from './help/routes.js'
import { home } from './home/routes.js'
import { login } from './login/routes.js'
import { logout } from './logout/routes.js'
import { runningServices } from './running-services/routes.js'
import { serveStaticFiles } from './common/helpers/serve-static-files.js'
import { services } from './services/routes.js'
import { teams } from './teams/routes.js'
import { testSuites } from './test-suites/routes.js'
import { utilities } from './utilities/routes.js'
import { repositories } from './repositories/routes.js'

const router = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register([inert])
      await server.register([
        admin,
        applyChangelog,
        auth,
        create,
        deployService,
        deployments,
        documentation,
        health,
        help,
        home,
        login,
        logout,
        repositories,
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
