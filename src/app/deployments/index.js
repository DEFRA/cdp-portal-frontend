import {
  deploymentController,
  deploymentsListController
} from '~/src/app/deployments/controllers'

const deployments = {
  plugin: {
    name: 'deployments',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/deployments',
          handler: deploymentsListController.handler
        },
        {
          method: 'GET',
          path: '/deployments/{deploymentId}',
          handler: deploymentController.handler
        }
      ])
    }
  }
}

export { deployments }
