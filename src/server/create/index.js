import {
  isNameAvailableController,
  chooseKindController,
  chooseKindFormController,
  startController
} from '~/src/server/create/controllers'
import { scopes } from '~/src/server/common/constants/scopes'
import { provideCreateSteps } from '~/src/server/create/helpers/form'
import { createTestSuiteRoutes } from '~/src/server/create/test-suite'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope'
import { createRepositoryRoutes } from '~/src/server/create/repository'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { createMicroserviceRoutes } from '~/src/server/create/microservice'
import { createEnvTestSuiteRoutes } from '~/src/server/create/env-test-suite'
import { createPerfTestSuiteRoutes } from '~/src/server/create/perf-test-suite'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'

const serviceTeamAndAdminUserScope = authScope([
  scopes.serviceTeamUser,
  scopes.admin
])

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
          ...createPerfTestSuiteRoutes
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}

export { create }
