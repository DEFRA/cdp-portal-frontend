import { transformRunningServicesToEntityRow } from '~/src/app/running-services/transformers/transform-running-services-to-entity-row'
import { fetchRunningServices } from '~/src/app/running-services/helpers/fetch-running-services'

const runningServicesListController = {
  handler: async (request, h) => {
    const runningServices = await fetchRunningServices()

    const entityRows = transformRunningServicesToEntityRow(runningServices)
    console.log(entityRows)
    return h.view('running-services/views/list', {
      pageTitle: 'Running Services',
      heading: 'Running Services',
      entityRows
    })
  }
}

export { runningServicesListController }
