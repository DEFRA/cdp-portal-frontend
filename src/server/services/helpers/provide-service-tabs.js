import { sortBy } from '../../common/helpers/sort/sort-by.js'
import { buildTab } from '../../common/patterns/entities/tabs/helpers/build-tab.js'

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

    const entityName = request.app.entity?.name
    const entity = request.app.entity
    const isServiceOwner = await request.userIsOwner(entity)

    response.source.context.tabDetails = {
      label: 'Service tabs'
    }
    response.source.context.tabDetails.tabs = [
      {
        isActive: request.path === `/services/${entityName}`,
        url: request.routeLookup('services/{serviceId}', {
          params: {
            serviceId: entityName
          }
        }),
        label: 'About'
      }
    ]

    if (isAdmin || isTenant) {
      buildTab(response, request, 'services', 'resources', entityName)
      buildTab(response, request, 'services', 'proxy', entityName)
    } else {
      response.source.context.tabDetails.displayTabs = false
    }

    if (isAdmin || isServiceOwner) {
      buildTab(response, request, 'services', 'automations', entityName)
      buildTab(response, request, 'services', 'secrets', entityName)
      buildTab(response, request, 'services', 'maintenance', entityName)
      buildTab(response, request, 'services', 'terminal', entityName)
    }

    response.source.context.tabDetails.tabs.sort(sortBy('label', 'asc'))
  }

  return h.continue
}

export { provideServiceTabs }
