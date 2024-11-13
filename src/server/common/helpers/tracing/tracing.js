import { AsyncLocalStorage } from 'node:async_hooks'
import { config } from '~/src/config/index.js'

const asyncLocalStorage = new AsyncLocalStorage()

function tracingMiddleware(handler) {
  return (req, h) => {
    const requestId = req.headers[config.get('tracing.header')]
    return asyncLocalStorage.run(
      { requestId: requestId || '' },
      // eslint-disable-next-line @typescript-eslint/require-await
      async () => {
        return handler(req, h)
      }
    )
  }
}

export function getTraceId() {
  return asyncLocalStorage.getStore()?.requestId
}

export function withTracing(routes) {
  if (!config.get('tracing.enabled')) {
    return routes
  }

  const applyTracing = (route) => ({
    ...route,
    handler: tracingMiddleware(route.handler)
  })

  if (Array.isArray(routes)) {
    return routes.map(applyTracing)
  }

  return applyTracing(routes)
}
