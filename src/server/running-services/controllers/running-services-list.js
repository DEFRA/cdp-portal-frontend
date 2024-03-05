import { compose } from 'lodash/fp'
import { kebabCase, upperFirst } from 'lodash'

import { sortBy } from '~/src/server/common/helpers/sort/sort-by'
import { withEnvironments } from '~/src/server/common/transformers/with-environments'
import { getEnvironments } from '~/src/server/running-services/helpers/get-environments'
import { servicesToEntityRows } from '~/src/server/running-services/transformers/services-to-entity-rows'
import { fetchRunningServices } from '~/src/server/running-services/helpers/fetch/fetch-running-services'

function buildRowHeadings(environments) {
  return [
    { text: 'Service', size: 'medium' },
    ...Object.keys(environments).map((key) => ({
      text: upperFirst(kebabCase(key)),
      size: 'small'
    }))
  ]
}

const runningServicesListController = {
  options: { id: 'running-services' },
  handler: async (request, h) => {
    const environments = await getEnvironments(request)
    const runningServices = await fetchRunningServices(environments)
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
