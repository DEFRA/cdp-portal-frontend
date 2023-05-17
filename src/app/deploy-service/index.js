import {
  availableVersionsController,
  deployServiceController,
  deployServiceFormController
} from '~/src/app/deploy-service/controllers'

const deployService = {
  plugin: {
    name: 'deploy service',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/deploy-service/available-versions',
          ...availableVersionsController
        },
        {
          method: 'GET',
          path: '/deploy-service',
          ...deployServiceFormController
        },
        {
          method: 'POST',
          path: '/deploy-service',
          ...deployServiceController
        }
      ])
    }
  }
}

export { deployService }
