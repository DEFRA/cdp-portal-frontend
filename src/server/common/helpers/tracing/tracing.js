import {
  asyncLocalStorage,
  getTraceId
} from '~/src/server/common/helpers/tracing/async-local-storage.js'
import { config } from '~/src/config/index.js'

function wrapLifecycle(request, store) {
  const requestLifecycle = request._lifecycle.bind(request)
  request._lifecycle = () => asyncLocalStorage.run(store, requestLifecycle)
}

/**
 * @satisfies {Plugin}
 */
const tracing = {
  plugin: {
    name: 'tracing',
    version: '0.1.0',
    register(server, options) {
      if (options.tracingEnabled) {
        server.ext('onRequest', (request, h) => {
          const tracingHeader = options.tracingHeader
          const traceId = request.headers[tracingHeader]
          const store = new Map()
          store.set('traceId', traceId)

          wrapLifecycle(request, store)

          return h.continue
        })
      }

      server.decorate('request', 'getTraceId', getTraceId)
      server.decorate('server', 'getTraceId', getTraceId)
    }
  },
  options: {
    tracingEnabled: config.get('tracing.enabled'),
    tracingHeader: config.get('tracing.header')
  }
}

export { tracing }

/**
 * @import { Plugin } from '@hapi/hapi'
 */
