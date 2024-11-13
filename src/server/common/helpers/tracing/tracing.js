import { AsyncLocalStorage } from 'node:async_hooks'
import { config } from '~/src/config/index.js'

const asyncLocalStorage = new AsyncLocalStorage()

function tracingMiddleware(handler) {
  return (req, h) => {
    if (req.headers?.[config.get('tracing.header')]) {
      const requestId = req.headers?.[config.get('tracing.header')] || ''
      // eslint-disable-next-line @typescript-eslint/require-await
      return asyncLocalStorage.run({ requestId }, async () => {
        return await handler(req, h)
      })
    }
    return handler(req, h)
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
