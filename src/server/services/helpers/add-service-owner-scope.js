import { scopes } from '~/src/server/common/constants/scopes'
import { config } from '~/src/config'

const secretsIsFeatureFlagged = config.get('featureFlags.secrets')

/**
 * Get the teams for a given services serviceId
 * Check to see if the logged-in user owns the service
 * add the serviceOwner scope if they do
 * @returns {{method: (function(*, *): Promise<*>)}}
 */
function addServiceOwnerScope() {
  return {
    method: async (request, h) => {
      const service = await request.server.methods.fetchDeployableService(
        request.params.serviceId
      )
      const serviceTeamIds = service.teams?.map((team) => team.teamId)
      const isServiceOwner = await request.userIsServiceOwner(serviceTeamIds)
      const { credentials } = request.auth

      const scope = [...credentials.scope]

      // FEATURE-FLAG - secrets added: 26/07/2024
      if (!secretsIsFeatureFlagged) {
        if (isServiceOwner) {
          scope.push(scopes.serviceOwner)
        }
      }
      credentials.scope = scope

      return h.continue
    }
  }
}

export { addServiceOwnerScope }
