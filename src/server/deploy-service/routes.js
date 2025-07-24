import { authScope } from '../common/helpers/auth/auth-scope.js'
import { scopes } from '../common/constants/scopes.js'
import { startDeployServiceController } from './controllers/deploy/start-deploy-service.js'
import { optionsFormController } from './controllers/deploy/options-form.js'
import { optionsController } from './controllers/deploy/options.js'
import { detailsController } from './controllers/deploy/details.js'
import { detailsFormController } from './controllers/deploy/details-form.js'
import { summaryController } from './controllers/deploy/summary.js'
import { deployController } from './controllers/deploy/deploy.js'
import { multistepForm } from '../common/helpers/multistep-form/multistep-form.js'
import { availableVersionsController } from './controllers/available-versions.js'
import { availableMemoryController } from './controllers/available-memory.js'
import { urls, formSteps } from './helpers/multistep-form/steps.js'
import { availableEnvironmentsController } from './controllers/available-environments.js'

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
