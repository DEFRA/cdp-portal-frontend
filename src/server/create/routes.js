import { isNameAvailableController } from './controllers/is-name-available.js'
import { startController } from './controllers/start.js'
import { chooseKindController } from './controllers/choose-kind.js'
import { chooseKindFormController } from './controllers/choose-kind-form.js'
import { scopes } from '@defra/cdp-validation-kit'
import { authScope } from '../common/helpers/auth/auth-scope.js'
import { sessionNames } from '../common/constants/session-names.js'
import { createJourneyTestSuiteRoutes } from './journey-test-suite/routes.js'
import { createRepositoryRoutes } from './repository/routes.js'
import { createMicroserviceRoutes } from './microservice/routes.js'
import { createPerfTestSuiteRoutes } from './perf-test-suite/routes.js'
import { checkFeatureToggle } from '../admin/features/helpers/check-feature-toggle.js'
import { createPrototypeRoutes } from './prototype/routes.js'
import { formSteps, urlTemplates } from './helpers/form/steps.js'
import { multistepForm } from '#server/plugins/multistep-form/multistep-form.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

const serverExtensions = [
  {
    type: 'onPreHandler',
    method: checkFeatureToggle,
    options: {
      sandbox: 'plugin'
    }
  }
]

const create = {
  plugin: {
    name: 'create',
    register: async (server) => {
      server.ext(serverExtensions)

      await server.register({
        plugin: multistepForm,
        options: {
          sessionName: sessionNames.create,
          urlTemplates,
          formSteps,
          ext: serverExtensions,
          routes: [
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
            ...createMicroserviceRoutes,
            ...createRepositoryRoutes,
            ...createJourneyTestSuiteRoutes,
            ...createPerfTestSuiteRoutes,
            ...createPrototypeRoutes
          ].map(serviceTeamAndAdminUserScope)
        }
      })

      server.route(
        [
          {
            method: 'GET',
            path: '/create/is-name-available/{repositoryName}',
            ...isNameAvailableController
          },
          {
            method: 'POST',
            path: '/create/choose-kind',
            ...chooseKindController
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}

export { create }
