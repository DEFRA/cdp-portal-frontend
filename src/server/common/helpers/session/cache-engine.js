import { buildRedisClient } from '../redis/redis-client.js'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'
import { Engine as CatboxMemory } from '@hapi/catbox-memory'
import { config } from '../../../../config/config.js'
import { createLogger } from '../logging/logger.js'
import { CatboxDynamoDB } from '@defra/catbox-dynamodb'
import { NodeHttpHandler } from '@smithy/node-http-handler'
import { Agent } from 'https'

/**
 * @typedef {'redis' | 'dynamodb' | 'memory'} Engine
 */

/**
 * @param {Engine} [engine]
 * @returns CatboxRedis | CatboxDynamodb | CatboxMemory
 */
export function getCacheEngine(engine) {
  const logger = createLogger()

  if (engine === 'redis') {
    logger.info('Using Redis session cache')
    const redisClient = buildRedisClient(config.get('redis'))
    return new CatboxRedis({ client: redisClient })
  }

  if (engine === 'dynamodb') {
    logger.info('Using DynamoDB session cache')
    return new CatboxDynamoDB({
      tableName: config.get('dynamoDb.tableName'),
      ttl: config.get('session.cache.ttl'),
      clientOptions: {
        endpoint: config.get('aws.dynamoDb.endpoint'),
        region: config.get('aws.region'),
        requestHandler: new NodeHttpHandler({
          httpsAgent: new Agent({ keepAlive: false })
        })
      },
      logger
    })
  }

  if (config.get('isProduction')) {
    logger.error(
      'Catbox Memory is for local development only, it should not be used in production!'
    )
    throw new Error('Attempting to use Catbox Memory in Production')
  }

  logger.info('Using Catbox Memory session cache')
  return new CatboxMemory()
}
