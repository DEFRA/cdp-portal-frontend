import { config } from '../../../config/config.js'

function setupCaches(server) {
  const session = server.cache({
    cache: 'session',
    segment: config.get('serverCacheSegment'),
    expiresIn: config.get('redis.ttl')
  })

  server.decorate('server', 'session', session)
  server.decorate('request', 'session', session)
}

export { setupCaches }
