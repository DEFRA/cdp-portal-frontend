/**
 * Provides tabs for the service view based on user authentication.
 * @param {import('@hapi/hapi').Request} request - The request object.
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @returns {Promise<symbol>}
 */
async function provideTabs(request, h) {
  const authedUser = await request.getUserSession()
  const isAdmin = authedUser?.isAdmin
  const isTenant = authedUser?.isTenant
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
      label: 'Test Suite tabs'
    }
    response.source.context.tabDetails.tabs = [
      {
        isActive: request.path === `/test-suites/${imageName}`,
        url: request.routeLookup('test-suites/{serviceId}', {
          params: {
            serviceId: imageName
          }
        }),
        label: 'About'
      }
    ]

    if (isAdmin || isTenant) {
      // response.source.context.tabDetails.tabs.push({
      //   isActive: request.path.startsWith(`/test-suites/${imageName}/proxy`),
      //   url: request.routeLookup('test-suites/{serviceId}/proxy', {
      //     params: {
      //       serviceId: imageName
      //     }
      //   }),
      //   label: 'Proxy'
      // })
    } else {
      response.source.context.tabDetails.displayTabs = false
    }

    if (isAdmin || isServiceOwner) {
      response.source.context.tabDetails.tabs.push({
        isActive: request.path.startsWith(`/test-suites/${imageName}/secrets`),
        url: request.routeLookup('test-suites/{serviceId}/secrets', {
          params: {
            serviceId: imageName
          }
        }),
        label: 'Secrets'
      })
    }
  }

  return h.continue
}

export { provideTabs }
