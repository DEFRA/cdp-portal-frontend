import { isNameAvailableController } from './controllers/is-name-available.js'
import { startController } from './controllers/start.js'
import { chooseKindController } from './controllers/choose-kind.js'
import { chooseKindFormController } from './controllers/choose-kind-form.js'
import { scopes } from '@defra/cdp-validation-kit'
import { provideCreateSteps } from './helpers/form/index.js'
import { authScope } from '../common/helpers/auth/auth-scope.js'
import { sessionNames } from '../common/constants/session-names.js'
import { provideFormContextValues } from '../common/helpers/form/provide-form-context-values.js'
import { createJourneyTestSuiteRoutes } from './journey-test-suite/routes.js'
import { createRepositoryRoutes } from './repository/routes.js'
import { createMicroserviceRoutes } from './microservice/routes.js'
import { createPerfTestSuiteRoutes } from './perf-test-suite/routes.js'
import { checkFeatureToggle } from '../admin/features/helpers/check-feature-toggle.js'
import { createPrototypeRoutes } from './prototype/routes.js'

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
          ...createPerfTestSuiteRoutes,
          ...createPrototypeRoutes
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}

export { create }
