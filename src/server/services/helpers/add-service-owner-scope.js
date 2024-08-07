import { scopes } from '~/src/server/common/constants/scopes'
import { config } from '~/src/config'

const secretsIsFeatureFlagged = config.get('featureFlags.secrets')

/**
 * Get the teams for a given services serviceId
 * Check to see if the logged-in user owns the service add the serviceOwner scope if they do
 * @param {import('@hapi/hapi').Request} request
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @returns {Promise<*>}
 */
async function addServiceOwnerScope(request, h) {
  const serviceId = request.params?.serviceId
  const isAuthenticated = request.auth.isAuthenticated

  if (serviceId && isAuthenticated) {
    const service =
      await request.server.methods.fetchDeployableService(serviceId)
    const serviceTeamIds = service.teams?.map((team) => team.teamId) ?? []
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
  }

  return h.continue
}

export { addServiceOwnerScope }
