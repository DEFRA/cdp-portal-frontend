import {
  deploymentController,
  deploymentsListController
} from '~/src/server/deployments/controllers'
import { config } from '~/src/config'

const deployments = {
  plugin: {
    name: 'deployments',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/deployments',
          handler: (request, h) =>
            h.redirect(config.get('appPathPrefix') + '/deployments/development')
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
