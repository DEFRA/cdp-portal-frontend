import { provideTabs } from './helpers/provide-tabs.js'
import { deploymentController } from './controllers/deployment.js'
import { deploymentsListController } from './controllers/deployments-list.js'
import { pagination } from '../common/constants/pagination.js'
import { databaseUpdateController } from './controllers/database-update.js'
import { performance } from 'perf_hooks'

const perf = {}

function start(request, h) {
  request.logger?.info('-------------- Deployments request start')
  perf.start = performance.now()
  return h.continue
}

function end(request, h) {
  perf.end = performance.now()
  request.logger?.info(`Controller took ${perf.end - perf.start}ms`)
  request.logger?.info('-------------- Deployments request end')
  return h.continue
}

const deployments = {
  plugin: {
    name: 'deployments',
    register: (server) => {
      server.ext([
        {
          type: 'onPreAuth',
          method: start,
          options: { sandbox: 'plugin' }
        },
        {
          type: 'onPostHandler',
          method: provideTabs,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPreResponse',
          method: end,
          options: { sandbox: 'plugin' }
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
