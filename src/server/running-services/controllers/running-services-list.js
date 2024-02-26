import { compose } from 'lodash/fp'

import { servicesToEntityRows } from '~/src/server/running-services/transformers/services-to-entity-rows'
import { fetchRunningServices } from '~/src/server/running-services/helpers/fetch/fetch-running-services'
import { withEnvironments } from '~/src/server/common/transformers/with-environments'
import { sortBy } from '~/src/server/common/helpers/sort/sort-by'

const runningServicesListController = {
  handler: async (request, h) => {
    const runningServices = await fetchRunningServices()
    const sortedRunningServices = runningServices?.sort(
      sortBy('service', 'asc')
    )

    const entityRows = compose(
      servicesToEntityRows,
      withEnvironments
    )(sortedRunningServices)

    return h.view('running-services/views/list', {
      pageTitle: 'Running Services',
      heading: 'Running Services',
      entityRows
    })
  }
}

export { runningServicesListController }
