import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { fetchDeployableService } from '~/src/server/common/helpers/fetch/fetch-deployable-service'

/**
 * Add global server methods
 * @param server {import("@hapi/hapi").Server}
 */
function addServerMethods(server) {
  const cache = {
    expiresIn: 60 * 1000,
    staleIn: 40 * 1000,
    staleTimeout: 10 * 1000,
    generateTimeout: 100
  }

  server.method('fetchDeployableService', fetchDeployableService, { cache })
  server.method('fetchRepository', fetchRepository, { cache })
}

export { addServerMethods }
