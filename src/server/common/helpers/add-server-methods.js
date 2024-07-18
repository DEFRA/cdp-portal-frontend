import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service'

/**
 * Add global server methods
 * @param server {Server}
 */
function addServerMethods(server) {
  server.method('fetchDeployableService', fetchDeployableService, {
    cache: {
      expiresIn: 60 * 1000,
      staleIn: 40 * 1000,
      staleTimeout: 10 * 1000,
      generateTimeout: 100
    }
  })
}

export { addServerMethods }

/**
 * import { Server } from '@hapi/hapi'
 */
