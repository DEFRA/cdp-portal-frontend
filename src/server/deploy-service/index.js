import { provideDeployServiceSteps } from '~/src/server/deploy-service/helpers/provide-deploy-service-steps'
import { provideFormContextValues } from '~/src/server/deploy-service/helpers/provide-form-context-values'
import {
  availableVersionsController,
  availableMemoryController,
  startDeployServiceController,
  detailsController,
  detailsFormController,
  optionsController,
  optionsFormController,
  summaryController,
  deployController,
  deploymentController
} from '~/src/server/deploy-service/controllers'

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
          method: provideDeployServiceSteps,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route([
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
        },
        {
          method: 'GET',
          path: '/deploy-service/deployment',
          ...deploymentController
        }
      ])
    }
  }
}

export { deployService }
