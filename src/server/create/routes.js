import { isNameAvailableController } from '~/src/server/create/controllers/is-name-available.js'
import { startController } from '~/src/server/create/controllers/start.js'
import { chooseKindController } from '~/src/server/create/controllers/choose-kind.js'
import { chooseKindFormController } from '~/src/server/create/controllers/choose-kind-form.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { provideCreateSteps } from '~/src/server/create/helpers/form/index.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { createJourneyTestSuiteRoutes } from '~/src/server/create/journey-test-suite/routes.js'
import { createRepositoryRoutes } from '~/src/server/create/repository/routes.js'
import { createMicroserviceRoutes } from '~/src/server/create/microservice/routes.js'
import { createPerfTestSuiteRoutes } from '~/src/server/create/perf-test-suite/routes.js'
import { checkFeatureToggle } from '~/src/server/admin/features/helpers/check-feature-toggle.js'

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
        },
        {
          type: 'onPreHandler',
          method: checkFeatureToggle,
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
          ...createJourneyTestSuiteRoutes,
          ...createPerfTestSuiteRoutes
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}

export { create }
