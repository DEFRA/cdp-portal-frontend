export const engineMetricsPlugin = {
  plugin: {
    name: 'engine-metrics',
    version: '1.0.0',
    register: (server, options) => {
      server.ext('onRequest', (request, h) => {
        request.cacheMetrics = { get: 0, set: 0, drop: 0 }

        options.cacheEngine.bindRequest(request)

        return h.continue
      })

      server.ext('onPreResponse', (request, h) => {
        if (!request.logger) {
          return h.continue
        }

        const getCount = request.cacheMetrics?.get ?? 0
        const setCount = request.cacheMetrics?.set ?? 0
        const dropCount = request.cacheMetrics?.drop ?? 0
        const totalCount = getCount + setCount + dropCount

        // adding here for context on hapi-pino options.customRequestCompleteMessage log
        if (totalCount) {
          request.logger = request.logger.child({
            event: {
              kind: 'cache requests',
              outcome: `${getCount + setCount + dropCount}`,
              reason: `gets ${getCount}, sets ${setCount}, drops ${dropCount}`
            }
          })
        }
        return h.continue
      })
    }
  }
}

export class EngineRequestsWrapper {
  constructor(engine) {
    this.engine = engine
  }

  bindRequest(request) {
    this.requestMetrics = request.cacheMetrics
  }

  count(op) {
    const metrics = this.requestMetrics
    if (metrics) {
      metrics[op]++
    }
  }

  async start() {
    return this.engine.start()
  }
  async stop() {
    return this.engine.stop()
  }

  async isReady() {
    return this.engine.isReady()
  }

  validateSegmentName(name) {
    return this.engine.validateSegmentName(name)
  }

  async get(key) {
    this.count('get')
    return this.engine.get(key)
  }

  async set(key, value, ttl) {
    this.count('set')
    return this.engine.set(key, value, ttl)
  }

  async drop(key) {
    this.count('drop')
    return this.engine.drop(key)
  }
}
