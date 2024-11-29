import compose from 'lodash/fp/compose.js'
import upperFirst from 'lodash/upperFirst.js'

import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { withEnvironments } from '~/src/server/common/transformers/with-environments.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { servicesToEntityRows } from '~/src/server/running-services/transformers/services-to-entity-rows.js'
import { fetchRunningServices } from '~/src/server/running-services/helpers/fetch/fetch-running-services.js'

function buildRowHeadings(environments) {
  return [
    { text: 'Service', size: 'medium' },
    ...environments.map((environment) => ({
      text: upperFirst(environment),
      size: 'small'
    }))
  ]
}

const runningServicesListController = {
  options: { id: 'running-services' },
  handler: async (request, h) => {
    const authedUser = await request.getUserSession()
    const environments = getEnvironments(authedUser?.scope)
    const runningServices = (await fetchRunningServices(environments)) ?? []
    const sortedRunningServices = runningServices?.sort(
      sortBy('service', 'asc')
    )

    const entityRows = compose(
      servicesToEntityRows(environments),
      withEnvironments
    )(sortedRunningServices)

    return h.view('running-services/views/list', {
      pageTitle: 'Running Services',
      heading: 'Running Services',
      rowHeadings: buildRowHeadings(environments),
      entityRows
    })
  }
}

export { runningServicesListController }
