import { fetchServices } from '~/src/app/services/helpers/fetch-services'
import { sortByTimestamp } from '~/src/app/common/helpers/sort-by-timestamp'
import { transformServiceToEntityRow } from '~/src/app/services/transformers/transform-service-to-entity-row'

const serviceListController = {
  handler: async (request, h) => {
    const services = await fetchServices()
    const entityRows = services
      .sort(sortByTimestamp())
      .map(transformServiceToEntityRow)

    return h.view('services/views/list', {
      pageTitle: 'Services',
      heading: 'Services',
      entityRows
    })
  }
}

export { serviceListController }
