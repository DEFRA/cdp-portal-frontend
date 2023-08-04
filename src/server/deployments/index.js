import {
  deploymentController,
  deploymentsListController
} from '~/src/server/deployments/controllers'
import { appConfig } from '~/src/config'

const deployments = {
  plugin: {
    name: 'deployments',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/deployments',
          handler: (request, h) =>
            h.redirect(appConfig.get('appPathPrefix') + '/deployments/snd')
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
