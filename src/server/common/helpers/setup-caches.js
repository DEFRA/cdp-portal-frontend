import { config } from '~/src/config/config.js'
import { FeatureToggleHelper } from '~/src/server/admin/features/helpers/feature-toggle.js'

function setupCaches(server) {
  const session = server.cache({
    cache: 'session',
    segment: config.get('serverCacheSegment'),
    expiresIn: config.get('redis.ttl')
  })

  server.decorate('server', 'session', session)
  server.decorate('request', 'session', session)

  const helper = new FeatureToggleHelper(session)

  server.decorate('server', 'featureToggles', () => helper, { apply: true })
  server.decorate('request', 'featureToggles', () => helper, { apply: true })
}

export { setupCaches }
