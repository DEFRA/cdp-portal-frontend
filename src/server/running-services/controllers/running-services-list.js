import upperFirst from 'lodash/upperFirst.js'

import { fetchFilters } from '~/src/server/deployments/helpers/fetch/fetch-filters.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import { transformRunningServices } from '~/src/server/running-services/helpers/transformers/running-services.js'

async function getFilters() {
  const filtersResponse = await fetchFilters()
  const serviceFilters = buildSuggestions(
    filtersResponse.filters.services.map((serviceName) => ({
      text: serviceName,
      value: serviceName
    }))
  )

  const order = [
    'running',
    'requested',
    'pending',
    'stopped',
    'stopping',
    'undeployed'
  ]
  const statusFilters = buildSuggestions(
    filtersResponse.filters.statuses
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .map((status) => ({
        text: upperFirst(status),
        value: status
      }))
  )

  return {
    serviceFilters,
    statusFilters
  }
}

const runningServicesListController = {
  options: { id: 'running-services' },
  handler: async (request, h) => {
    const { serviceFilters, statusFilters } = await getFilters()

    const authedUser = await request.getUserSession()
    const environments = getEnvironments(authedUser?.scope)
    const runningServices = await transformRunningServices(
      request,
      environments
    )

    return h.view('running-services/views/list', {
      pageTitle: 'Running Services',
      runningServices,
      environments,
      serviceFilters,
      statusFilters
    })
  }
}

export { runningServicesListController }
