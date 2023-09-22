import Redis from 'ioredis'
import Boom from '@hapi/boom'

import { appConfig } from '~/src/config'

const redisController = {
  handler: (request, h) => {
    try {
      const cluster = new Redis.Cluster(
        [{ host: appConfig.get('cacheHost'), port: 6379 }],
        {
          scaleReads: 'all',
          redisOptions: {
            username: appConfig.get('cacheUsername'),
            password: appConfig.get('cachePassword'),
            enableAutoPipelining: true,
            db: 0,
            ...(appConfig.get('isProduction') && { tls: {} })
          }
        }
      )

      return new Promise((resolve, reject) =>
        cluster.ping(function (err, result) {
          if (err) {
            request.logger.error(err)
            reject(Boom.boomify(Boom.internal(err)))
          }

          return resolve(h.response({ message: 'success', result }).code(200))
        })
      )
    } catch (error) {
      return h.response({ message: 'failure', error }).code(500)
    }
  }
}

export { redisController }
