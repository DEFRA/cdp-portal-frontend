import { deploymentsController } from '~/src/app/deployments/controller'

const deployments = {
  plugin: {
    name: 'deployments',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/deployments',
          handler: deploymentsController.handler
        }
      ])
    }
  }
}

export { deployments }
