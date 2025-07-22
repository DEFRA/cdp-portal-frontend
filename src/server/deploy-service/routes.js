import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { startDeployServiceController } from '~/src/server/deploy-service/controllers/deploy/start-deploy-service.js'
import { optionsFormController } from '~/src/server/deploy-service/controllers/deploy/options-form.js'
import { optionsController } from '~/src/server/deploy-service/controllers/deploy/options.js'
import { detailsController } from '~/src/server/deploy-service/controllers/deploy/details.js'
import { detailsFormController } from '~/src/server/deploy-service/controllers/deploy/details-form.js'
import { summaryController } from '~/src/server/deploy-service/controllers/deploy/summary.js'
import { deployController } from '~/src/server/deploy-service/controllers/deploy/deploy.js'
import { multistepForm } from '~/src/server/common/helpers/multistep-form/multistep-form.js'
import { availableVersionsController } from '~/src/server/deploy-service/controllers/available-versions.js'
import { availableMemoryController } from '~/src/server/deploy-service/controllers/available-memory.js'
import { availableEnvironmentsController } from '~/src/server/deploy-service/controllers/available-environments.js'
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
          },
          {
            method: 'GET',
            path: '/deploy-service/available-environments',
            ...availableEnvironmentsController
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}

export { deployService }
