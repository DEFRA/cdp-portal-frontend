import { performance } from 'perf_hooks'
import { runningServicesListController } from './controllers/running-services-list.js'
import { runningServiceController } from './controllers/running-service.js'

const perf = {}

function start(request, h) {
  request.logger?.info('-------------- Running services request start')
  perf.start = performance.now()
  return h.continue
}

function end(request, h) {
  perf.end = performance.now()
  request.logger?.info(`Controller took ${perf.end - perf.start}ms`)
  request.logger?.info('-------------- Running services request end')
  return h.continue
}

const runningServices = {
  plugin: {
    name: 'running services',
    register: (server) => {
      server.ext([
        {
          type: 'onPreAuth',
          method: start,
          options: { sandbox: 'plugin' }
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
          path: '/running-services',
          ...runningServicesListController
        },
        {
          method: 'GET',
          path: '/running-services/{serviceName}',
          ...runningServiceController
        }
      ])
    }
  }
}

export { runningServices }
