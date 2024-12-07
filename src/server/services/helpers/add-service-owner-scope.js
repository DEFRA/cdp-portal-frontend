import { scopes } from '~/src/server/common/constants/scopes.js'

/**
 * Get the teams for a given services serviceId
 * Check to see if the logged-in user owns the service add the serviceOwner scope if they do
 * This method is called via the ext onCredentials. So will only be called when a user is asked to authenticate
 * @param {import('@hapi/hapi').Request} request
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @returns {Promise<*>}
 */
async function addServiceOwnerScope(request, h) {
  const service = request.app.service
  const { credentials, isAuthenticated } = request.auth

  if (isAuthenticated && service) {
    const isServiceOwner = await request.userIsServiceOwner(
      service.teams?.map((team) => team.teamId) ?? []
    )

    const scope = [...credentials.scope]

    if (isServiceOwner) {
      scope.push(scopes.serviceOwner)
    }

    credentials.scope = scope
  }

  return h.continue
}

export { addServiceOwnerScope }
