import { millis } from '@defra/cdp-metrics'
import { monitorEventLoopDelay } from 'perf_hooks'
import { config } from '../../../../config/config.js'

export const nodeVmMetrics = {
  plugin: {
    name: 'mongoDb',
    version: '1.0.0',
    register: async function (server, options) {
      if (options?.enabled === false) {
        server.logger.info('Node VM Metrics is disabled')
        return
      }

      const threshold = options.threshold ?? 20
      const pollInterval = options.pollInterval
      const histogram = monitorEventLoopDelay({ resolution: 20 })
      histogram.enable()

      const poller = setInterval(() => {
        const maxMs = histogram.max / 1e6
        const meanMs = histogram.mean / 1e6
        const max = Number(maxMs.toFixed(2))
        if (maxMs > threshold) {
          server.logger.warn(
            `high event loop delay max:${max} vs mean ${meanMs}`,
            {
              event: { duration: max }
            }
          )
        }

        millis('EventLoop_max', maxMs)
        millis('EventLoop_mean', meanMs)

        histogram.reset()
      }, pollInterval)

      poller.unref()

      server.ext('onPostStop', () => {
        if (poller) {
          clearInterval(poller)
        }
        if (histogram) {
          histogram.disable()
        }
      })
    }
  },
  options: {
    threshold: config.get('perf.eventLoop.threshold'),
    pollInterval: config.get('perf.eventLoop.pollInterval'),
    enabled: config.get('perf.enabled')
  }
}
