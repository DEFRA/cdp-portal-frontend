import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { buildTab } from '~/src/server/common/patterns/entities/tabs/helpers/build-tab.js'

/**
 * Provides tabs for the service view based on user authentication.
 * @param {import('@hapi/hapi').Request} request - The request object.
 * @param {import('@hapi/hapi').ResponseToolkit} h
 * @returns {Promise<symbol>}
 */
async function provideServiceTabs(request, h) {
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

    if (isAdmin || isTenant) {
      buildTab(response, request, 'services', 'buckets', imageName)
      buildTab(response, request, 'services', 'proxy', imageName)
    } else {
      response.source.context.tabDetails.displayTabs = false
    }

    if (isAdmin || isServiceOwner) {
      buildTab(response, request, 'services', 'automations', imageName)
      buildTab(response, request, 'services', 'secrets', imageName)
      buildTab(response, request, 'services', 'terminal', imageName)
    }

    response.source.context.tabDetails.tabs.sort(sortBy('label', 'asc'))
  }

  return h.continue
}

export { provideServiceTabs }
