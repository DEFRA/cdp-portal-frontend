import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Engine as CatboxRedis } from '@hapi/catbox-redis'
import { Engine as CatboxMemory } from '@hapi/catbox-memory'
import { CatboxDynamoDB } from '@defra/catbox-dynamodb'

import { getCacheEngine } from './cache-engine.js'
import { config } from '../../../../config/config.js'
import * as loggerModule from '../logging/logger.js'
import { NodeHttpHandler } from '@smithy/node-http-handler'
import { Agent } from 'https'

let mockLoggerInfo
let mockLoggerError

vi.mock('@hapi/catbox-redis')
vi.mock('@hapi/catbox-memory')
vi.mock('@defra/catbox-dynamodb')
vi.mock('src/server/common/helpers/redis/redis-client.js', () => ({
  buildRedisClient: vi.fn().mockReturnValue({})
}))

describe('#getCacheEngine', () => {
  beforeEach(() => {
    mockLoggerInfo = vi.fn()
    mockLoggerError = vi.fn()

    vi.spyOn(loggerModule, 'createLogger').mockImplementation(() => ({
      info: mockLoggerInfo,
      error: mockLoggerError
    }))

    vi.clearAllMocks()
  })

  describe('When Redis cache engine has been requested', () => {
    test('Should setup Redis cache', () => {
      getCacheEngine('redis')
      expect(CatboxRedis).toHaveBeenCalledWith(expect.any(Object))
    })

    test('Should log expected Redis message', () => {
      getCacheEngine('redis')
      expect(mockLoggerInfo).toHaveBeenCalledWith('Using Redis session cache')
    })
  })

  describe('When DynamoDB cache engine has been requested', () => {
    beforeEach(() => {
      vi.spyOn(config, 'get').mockImplementation((key) => {
        switch (key) {
          case 'dynamoDb.tableName':
            return 'table'
          case 'session.cache.ttl':
            return 1234
          case 'aws.dynamoDb.endpoint':
            return 'endpoint'
          case 'aws.region':
            return 'region'
          default:
            return false
        }
      })
    })

    test('Should setup DynamoDB cache', () => {
      getCacheEngine('dynamodb')
      expect(CatboxDynamoDB).toHaveBeenCalledWith({
        tableName: 'table',
        ttlInMillis: 1234,
        consistentReads: true,
        clientOptions: {
          endpoint: 'endpoint',
          region: 'region',
          requestHandler: new NodeHttpHandler({
            httpsAgent: new Agent({ keepAlive: false })
          })
        },
        logger: expect.any(Object)
      })
    })

    test('Should log expected DynamoDB message', () => {
      getCacheEngine('dynamodb')
      expect(mockLoggerInfo).toHaveBeenCalledWith(
        'Using DynamoDB session cache'
      )
    })
  })

  describe('When In memory cache engine has been requested', () => {
    test('Should setup Catbox memory', () => {
      getCacheEngine()
      expect(CatboxMemory).toHaveBeenCalledTimes(1)
    })

    test('Should log expected Catbox memory message', () => {
      getCacheEngine()
      expect(mockLoggerInfo).toHaveBeenCalledWith(
        'Using Catbox Memory session cache'
      )
    })
  })

  describe('When In memory cache engine has been requested in Production', () => {
    beforeEach(() => {
      vi.spyOn(config, 'get').mockImplementation((key) => {
        return key === 'isProduction'
      })
    })

    test('Should throw error and log Production warning message', () => {
      expect(() => getCacheEngine()).toThrow(
        'Attempting to use Catbox Memory in Production'
      )

      expect(mockLoggerError).toHaveBeenCalledWith(
        'Catbox Memory is for local development only, it should not be used in production!'
      )
    })
  })
})
