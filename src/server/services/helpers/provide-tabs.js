/**
 * Provides tabs for the service view based on user authentication.
 * @param {import('@hapi/hapi').Request} request - The request object.
 * @param {import('@hapi/hapi').ResponseToolkit} h
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

    response.source.context.tabDetails = {
      label: 'Service tabs'
    }
    response.source.context.tabDetails.tabs = [
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

    if (authedUser) {
      response.source.context.tabDetails.tabs.push({
        isActive: request.path.startsWith(`/services/${imageName}/buckets`),
        url: request.routeLookup('services/{serviceId}/buckets', {
          params: {
            serviceId: imageName
          }
        }),
        label: 'Buckets'
      })
    } else {
      response.source.context.tabDetails.displayTabs = false
    }

    if (authedUser) {
      response.source.context.tabDetails.tabs.push({
        isActive: request.path.startsWith(`/services/${imageName}/proxy`),
        url: request.routeLookup('services/{serviceId}/proxy', {
          params: {
            serviceId: imageName
          }
        }),
        label: 'Proxy'
      })
    }

    if (isAdmin || isServiceOwner) {
      response.source.context.tabDetails.tabs.push({
        isActive: request.path.startsWith(`/services/${imageName}/secrets`),
        url: request.routeLookup('services/{serviceId}/secrets', {
          params: {
            serviceId: imageName
          }
        }),
        label: 'Secrets'
      })
    }

    if (isAdmin || isServiceOwner) {
      response.source.context.tabDetails.tabs.push({
        isActive: request.path.startsWith(`/services/${imageName}/terminal`),
        url: request.routeLookup('services/{serviceId}/terminal', {
          params: {
            serviceId: imageName
          }
        }),
        label: 'Terminal'
      })
    }
  }

  return h.continue
}

export { provideTabs }
