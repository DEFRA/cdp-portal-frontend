import inert from '@hapi/inert'

import { admin } from '~/src/server/admin/routes.js'
import { applyChangelog } from '~/src/server/apply-changelog/routes.js'
import { auth } from '~/src/server/auth/index.js'
import { create } from '~/src/server/create/routes.js'
import { deployService } from '~/src/server/deploy-service/routes.js'
import { deployments } from '~/src/server/deployments/routes.js'
import { documentation } from '~/src/server/documentation/routes.js'
import { health } from '~/src/server/health/routes.js'
import { help } from '~/src/server/help/routes.js'
import { home } from '~/src/server/home/routes.js'
import { login } from '~/src/server/login/routes.js'
import { logout } from '~/src/server/logout/routes.js'
import { runningServices } from '~/src/server/running-services/routes.js'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files.js'
import { services } from '~/src/server/services/routes.js'
import { teams } from '~/src/server/teams/routes.js'
import { testSuites } from '~/src/server/test-suites/routes.js'
import { utilities } from '~/src/server/utilities/routes.js'
import { repositories } from '~/src/server/repositories/routes.js'
import { checkFeatureToggles } from '~/src/server/admin/features/helpers/check-feature-toggles.js'

const router = {
  plugin: {
    name: 'router',
    register: async (server) => {
      server.ext([
        {
          type: 'onPreHandler',
          method: checkFeatureToggles
        }
      ])

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
