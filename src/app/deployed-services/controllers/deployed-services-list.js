import { fetchDeployedServices } from '~/src/app/deployed-services/helpers/fetch-deployed-services'
import { sortByTimestamp } from '~/src/app/common/helpers/sort-by-timestamp'
import { transformDeployedServicesToEntityRow } from '~/src/app/deployed-services/transformers/transform-deployed-services-to-entity-row'

const deployedServicesListController = {
  handler: async (request, h) => {
    const deployedServices = await fetchDeployedServices()
    const entityRows = deployedServices
      .sort(sortByTimestamp())
      .map(transformDeployedServicesToEntityRow)

    return h.view('deployed-services/views/list', {
      pageTitle: 'Deployed Services',
      heading: 'Deployed Services',
      entityRows
    })
  }
}

export { deployedServicesListController }
