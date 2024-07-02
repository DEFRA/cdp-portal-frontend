import { provideTabs } from '~/src/server/deployments/helpers/provide-tabs'
import { fetchFilters } from '~/src/server/deployments/helpers/fetch/fetch-filters'
import {
  deploymentController,
  deploymentsListController
} from '~/src/server/deployments/controllers'
import { pagination } from '~/src/server/common/constants/pagination'

const deployments = {
  plugin: {
    name: 'deployments',
    register: (server) => {
      server.method('fetchFilters', fetchFilters, {
        cache: {
          expiresIn: 60 * 1000,
          staleIn: 40 * 1000,
          staleTimeout: 10 * 1000,
          generateTimeout: 100
        }
      })

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
              `/deployments/prod?page=${pagination.page}&size=${pagination.size}`
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
