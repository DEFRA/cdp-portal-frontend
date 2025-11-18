import { millis, byteSize } from '@defra/cdp-metrics'
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

      server.logger.info('Node VM Metrics enabled')
      const threshold = options.threshold ?? 50
      const pollInterval = options.pollInterval

      const poller = setInterval(() => {
        const load = server.load

        const eventLoopDelay = Number(load.eventLoopDelay.toFixed(2))
        const eventLoopUtilization = Number(
          load.eventLoopUtilization.toFixed(2)
        )
        if (load.eventLoopDelay >= threshold) {
          server.logger.warn(`high event loop delay max:${eventLoopDelay}`)
        }

        millis('NodeEventLoopDelay', eventLoopDelay)
        millis('NodeEventLoopUtilization', eventLoopUtilization)
        byteSize('NodeMemoryHeap', load.heapUsed)
        byteSize('NodeMemoryRss', load.rss)
      }, pollInterval)

      poller.unref()

      server.ext('onPostStop', () => {
        if (poller) {
          clearInterval(poller)
        }
      })
    }
  },
  options: {
    threshold: 50,
    pollInterval: config.get('monitoring.interval'),
    enabled: config.get('monitoring.interval') > 0
  }
}
