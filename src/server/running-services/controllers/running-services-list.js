import { compose } from 'lodash/fp'
import { kebabCase, upperFirst } from 'lodash'

import { sortBy } from '~/src/server/common/helpers/sort/sort-by'
import { withEnvironments } from '~/src/server/common/transformers/with-environments'
import { getEnvironments } from '~/src/server/running-services/helpers/get-environments'
import { servicesToEntityRows } from '~/src/server/running-services/transformers/services-to-entity-rows'
import { fetchRunningServices } from '~/src/server/running-services/helpers/fetch/fetch-running-services'

function buildRowHeadings(envs) {
  return [
    { text: 'Service', size: 'medium' },
    ...Object.keys(envs).map((key) => ({
      text: upperFirst(kebabCase(key)),
      size: 'small'
    }))
  ]
}

const runningServicesListController = {
  options: { id: 'running-services' },
  handler: async (request, h) => {
    const envs = await getEnvironments(request)
    const runningServices = await fetchRunningServices(envs)
    const sortedRunningServices = runningServices?.sort(
      sortBy('service', 'asc')
    )

    const entityRows = compose(
      servicesToEntityRows(envs),
      withEnvironments
    )(sortedRunningServices)

    return h.view('running-services/views/list', {
      pageTitle: 'Running Services',
      heading: 'Running Services',
      rowHeadings: buildRowHeadings(envs),
      entityRows
    })
  }
}

export { runningServicesListController }
