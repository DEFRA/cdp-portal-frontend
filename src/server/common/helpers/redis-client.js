import IoRedis from 'ioredis'

import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

/**
 * Setup Redis and provide a redis client
 *
 * Local development - 1 Redis instance
 * Out in the wild - Elasticache / Redis Cluster with username and password
 *
 * @returns {Cluster | Redis}
 */
function buildRedisClient() {
  const logger = createLogger()
  const port = 6379
  const db = 0
  let redisClient

  if (appConfig.get('isProduction')) {
    redisClient = new IoRedis.Cluster(
      [
        {
          host: appConfig.get('cacheHost'),
          port
        }
      ],
      {
        slotsRefreshTimeout: 2000,
        dnsLookup: (address, callback) => callback(null, address),
        redisOptions: {
          username: appConfig.get('cacheUsername'),
          password: appConfig.get('cachePassword'),
          db,
          tls: {}
        }
      }
    )
  }

  if (appConfig.get('isDevelopment')) {
    redisClient = new IoRedis({
      port,
      host: appConfig.get('cacheHost'),
      db
    })
  }

  redisClient.on('connect', () => {
    logger.info('Connected to Redis server')
  })

  redisClient.on('close', () => {
    logger.info('Redis connection closed attempting reconnect')
    redisClient.connect()
  })

  redisClient.on('error', (error) => {
    logger.error(`Redis connection error ${error}`)
  })

  return redisClient
}

export { buildRedisClient }
