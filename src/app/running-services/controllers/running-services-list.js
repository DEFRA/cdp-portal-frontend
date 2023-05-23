import { compose } from 'lodash/fp'

import { transformServicesToEntityRows } from '~/src/app/running-services/transformers/transform-services-to-entity-rows'
import { fetchRunningServices } from '~/src/app/running-services/helpers/fetch-running-services'
import { transformWithEnvironments } from '~/src/app/running-services/transformers/transform-with-environments'

const runningServicesListController = {
  handler: async (request, h) => {
    const runningServices = await fetchRunningServices()

    const entityRows = compose(
      transformServicesToEntityRows,
      transformWithEnvironments
    )(runningServices)

    return h.view('running-services/views/list', {
      pageTitle: 'Running Services',
      heading: 'Running Services',
      entityRows
    })
  }
}

export { runningServicesListController }
