import { provideTabs } from '~/src/server/deployments/helpers/provide-tabs'
import {
  deploymentController,
  deploymentsListController
} from '~/src/server/deployments/controllers'
import { pagination } from '~/src/server/common/constants/pagination'

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
          handler: (request, h) =>
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
