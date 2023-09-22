import Redis from 'ioredis'
import Boom from '@hapi/boom'

import { appConfig } from '~/src/config'

const redisController = {
  handler: (request, h) => {
    try {
      const redis = new Redis({
        port: 6379,
        host: appConfig.get('cacheHost'),
        username: appConfig.get('cacheUsername'),
        password: appConfig.get('cachePassword'),
        db: 0
      })

      return new Promise((resolve, reject) =>
        redis.ping(function (err, result) {
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
