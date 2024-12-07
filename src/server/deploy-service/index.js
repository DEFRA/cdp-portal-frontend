import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
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
} from '~/src/server/deploy-service/controllers/index.js'
import { multistepForm } from '~/src/server/common/helpers/multistep-form/multistep-form.js'
import {
  urls,
  formSteps
} from '~/src/server/deploy-service/helpers/multistep-form/steps.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

/**
 * The deploy service plugin
 * @satisfies {import('@hapi/hapi').Plugin}
 */
const deployService = {
  plugin: {
    name: 'deploy service',
    register: async (server) => {
      await server.register({
        plugin: multistepForm,
        options: {
          urls,
          formSteps,
          routes: [
            {
              method: 'GET',
              path: '/deploy-service',
              ...startDeployServiceController
            },
            {
              method: 'GET',
              path: '/deploy-service/details/{multiStepFormId?}',
              ...detailsFormController
            },
            {
              method: 'POST',
              path: '/deploy-service/details/{multiStepFormId?}',
              ...detailsController
            },
            {
              method: 'GET',
              path: '/deploy-service/options/{multiStepFormId}',
              ...optionsFormController
            },
            {
              method: 'POST',
              path: '/deploy-service/options/{multiStepFormId}',
              ...optionsController
            },
            {
              method: 'GET',
              path: '/deploy-service/summary/{multiStepFormId}',
              ...summaryController
            },
            {
              method: 'POST',
              path: '/deploy-service/deploy/{multiStepFormId}',
              ...deployController
            }
          ].map(serviceTeamAndAdminUserScope)
        }
      })

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
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}

export { deployService }
