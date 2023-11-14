import {
  deploymentController,
  deploymentsListController
} from '~/src/server/deployments/controllers'

const deployments = {
  plugin: {
    name: 'deployments',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/deployments',
          handler: (request, h) => h.redirect('/deployments/dev')
        },
        {
          method: 'GET',
          path: '/deployments/{environment}',
          ...deploymentsListController
        },
        {
          method: 'GET',
          path: '/deployments/{environment}/{deploymentId}',
          ...deploymentController
        }
      ])
    }
  }
}

export { deployments }
