/**
 * Provides tabs for the service view based on user authentication.
 *
 * @param {import('@hapi/hapi').Request} request - The request object.
 * @param {import('@hapi/hapi').ResponseToolkit} h - The response toolkit.
 * @returns {Promise<Symbol>}
 */
async function provideTabs(request, h) {
  const authedUser = await request.getUserSession()
  const isAuthenticated = authedUser?.isAuthenticated
  const isAdmin = authedUser?.isAdmin
  const response = request.response

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    const imageName = response.source?.context?.service?.imageName
    const teams = response.source?.context?.service?.teams ?? []
    const serviceTeamIds = teams.map((team) => team.teamId)
    const isServiceOwner = await request.userIsServiceOwner(serviceTeamIds)

    response.source.context.tabs = [
      {
        isActive: request.path === `/services/${imageName}`,
        url: request.routeLookup('services/{serviceId}', {
          params: {
            serviceId: imageName
          }
        }),
        label: 'About'
      }
    ]

    if (isAdmin || isServiceOwner) {
      response.source.context.tabs.push({
        isActive: request.path.startsWith(`/services/${imageName}/secrets`),
        url: request.routeLookup('services/{serviceId}/secrets', {
          params: {
            serviceId: imageName
          }
        }),
        label: 'Secrets'
      })
    }

    if (!isAuthenticated) {
      response.source.context.displayTabs = false
    }
  }

  return h.continue
}

export { provideTabs }
