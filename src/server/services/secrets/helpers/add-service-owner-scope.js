import { config } from '~/src/config'
import { scopes } from '~/src/server/common/constants/scopes'

const secretsIsFeatureFlagged = config.get('featureFlags.secrets')

/**
 * Get the teams for a given services serviceId
 * Check to see if the logged-in user owns the service add the serviceOwner scope if they do
 * This method is called via the ext onCredentials. So will only be called when a user is asked to authenticate
 *
 * @param {import('@hapi/hapi').Request} request
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @returns {Promise<*>}
 */
async function addServiceOwnerScope(request, h) {
  const service = request.app.service
  const isServiceOwner = await request.userIsServiceOwner(
    service.teams?.map((team) => team.teamId) ?? []
  )
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

export { addServiceOwnerScope }
