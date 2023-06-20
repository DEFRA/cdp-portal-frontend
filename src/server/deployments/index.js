import {
  deploymentController,
  deploymentsListController
} from '~/src/server/deployments/controllers'

const deployments = {
  plugin: {
    name: 'deployments',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/deployments',
          ...deploymentsListController
        },
        {
          method: 'GET',
          path: '/deployments/{deploymentId}',
          ...deploymentController
        }
      ])
    }
  }
}

export { deployments }
