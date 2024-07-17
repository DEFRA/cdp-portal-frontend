import { authScope } from '~/src/server/common/helpers/auth/auth-scope'
import { scopes } from '~/src/server/common/constants/scopes'
import {
  provideFormContextValues,
  provideDeploymentSteps
} from '~/src/server/deploy-service/helpers/form'
import {
  availableVersionsController,
  availableMemoryController,
  startDeployServiceController,
  detailsController,
  detailsFormController,
  optionsController,
  optionsFormController,
  summaryController,
  deployController
} from '~/src/server/deploy-service/controllers'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

const deployService = {
  plugin: {
    name: 'deploy service',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideFormContextValues,
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideDeploymentSteps,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/deploy-service/available-versions',
            ...availableVersionsController
          },
          {
            method: 'GET',
            path: '/deploy-service/available-memory',
            ...availableMemoryController
          },
          {
            method: 'GET',
            path: '/deploy-service',
            ...startDeployServiceController
          },
          {
            method: 'GET',
            path: '/deploy-service/details',
            ...detailsFormController
          },
          {
            method: 'POST',
            path: '/deploy-service/details',
            ...detailsController
          },
          {
            method: 'GET',
            path: '/deploy-service/options',
            ...optionsFormController
          },
          {
            method: 'POST',
            path: '/deploy-service/options',
            ...optionsController
          },
          {
            method: 'GET',
            path: '/deploy-service/summary',
            ...summaryController
          },
          {
            method: 'POST',
            path: '/deploy-service/deploy',
            ...deployController
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}

export { deployService }
