import { provideTabs } from '~/src/server/deployments/helpers/provide-tabs.js'
import { deploymentController } from '~/src/server/deployments/controllers/deployment.js'
import { deploymentsListController } from '~/src/server/deployments/controllers/deployments-list.js'
import { pagination } from '~/src/server/common/constants/pagination.js'

const deployments = {
  plugin: {
    name: 'deployments',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideTabs,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route([
        {
          method: 'GET',
          path: '/deployments',
          options: {
            id: 'deployments'
          },
          handler: (_request, h) =>
            h.redirect(
              `/deployments/dev?page=${pagination.page}&size=${pagination.size}`
            )
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
