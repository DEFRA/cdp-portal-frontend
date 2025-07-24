import { provideTabs } from './helpers/provide-tabs.js'
import { deploymentController } from './controllers/deployment.js'
import { deploymentsListController } from './controllers/deployments-list.js'
import { pagination } from '../common/constants/pagination.js'
import { databaseUpdateController } from './controllers/database-update.js'

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
        },
        {
          method: 'GET',
          path: '/deployments/database-updates/{environment}/{migrationId}',
          ...databaseUpdateController
        }
      ])
    }
  }
}

export { deployments }
