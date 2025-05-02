import { config } from '~/src/config/config.js'

/**
 * Add server caches
 * @param {import('@hapi/hapi').Server} server
 */
function setupCaches(server) {
  const sessionCache = server.cache({
    cache: 'session',
    segment: config.get('serverCacheSegment'),
    expiresIn: config.get('redis.ttl')
  })

  server.decorate('server', 'session', sessionCache)
  server.decorate('request', 'session', sessionCache)

  const featureTogglesCache = server.cache({
    cache: 'featureToggles',
    segment: config.get('featureToggles.segment'),
    expiresIn: config.get('featureToggles.ttl')
  })

  server.decorate('server', 'featureToggles', featureTogglesCache)
  server.decorate('request', 'featureToggles', featureTogglesCache)
}

export { setupCaches }
