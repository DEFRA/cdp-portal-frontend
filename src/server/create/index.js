import {
  isNameAvailableController,
  chooseKindController,
  chooseKindFormController,
  startController
} from '~/src/server/create/controllers/index.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { provideCreateSteps } from '~/src/server/create/helpers/form/index.js'
import { createTestSuiteRoutes } from '~/src/server/create/journey-test-suite/index.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { createRepositoryRoutes } from '~/src/server/create/repository/index.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { createMicroserviceRoutes } from '~/src/server/create/microservice/index.js'
import { createEnvTestSuiteRoutes } from '~/src/server/create/env-test-suite/index.js'
import { createPerfTestSuiteRoutes } from '~/src/server/create/perf-test-suite/index.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { createSmokeTestSuiteRoutes } from '~/src/server/create/smoke-test-suite/index.js'
import { withTracing } from '~/src/server/common/helpers/tracing/tracing.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

const create = {
  plugin: {
    name: 'create',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideFormContextValues(sessionNames.create),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideCreateSteps,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/create/is-name-available/{repositoryName}',
            ...isNameAvailableController
          },
          {
            method: 'GET',
            path: '/create',
            ...startController
          },
          {
            method: 'GET',
            path: '/create/choose-kind',
            ...chooseKindFormController
          },
          {
            method: 'POST',
            path: '/create/choose-kind',
            ...chooseKindController
          },
          ...createMicroserviceRoutes,
          ...createRepositoryRoutes,
          ...createEnvTestSuiteRoutes,
          ...createTestSuiteRoutes,
          ...createPerfTestSuiteRoutes,
          ...createSmokeTestSuiteRoutes
        ]
          .map(serviceTeamAndAdminUserScope)
          .map(withTracing)
      )
    }
  }
}

export { create }
