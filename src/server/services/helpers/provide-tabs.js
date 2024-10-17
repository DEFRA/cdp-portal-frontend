/**
 * Provides tabs for the service view based on user authentication.
 * @param {Request} request - The request object.
 * @param {ResponseToolkit} h - The response toolkit.
 * @returns {Promise<symbol>}
 */
async function provideTabs(request, h) {
  const authedUser = await request.getUserSession()
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

      if (isAdmin) {
        // TODO move to above when ready for release
        response.source.context.tabs.push({
          isActive: request.path.startsWith(`/services/${imageName}/terminal`),
          url: request.routeLookup('services/{serviceId}/terminal', {
            params: {
              serviceId: imageName
            }
          }),
          label: 'Terminal'
        })
      }
    } else {
      response.source.context.displayTabs = false
    }
  }

  return h.continue
}

export { provideTabs }
/**
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 */
