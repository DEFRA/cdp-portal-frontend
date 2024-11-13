import { provideTabs } from '~/src/server/deployments/helpers/provide-tabs.js'
import {
  deploymentController,
  deploymentsListController
} from '~/src/server/deployments/controllers/index.js'
import { pagination } from '~/src/server/common/constants/pagination.js'
import { withTracing } from '~/src/server/common/helpers/tracing/tracing.js'

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

      server.route(
        [
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
        ].map(withTracing)
      )
    }
  }
}

export { deployments }
