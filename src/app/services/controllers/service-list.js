import { fetchServices } from '~/src/app/services/helpers/fetch-services'
import { sortBy } from '~/src/common/helpers/sort-by'
import { transformServiceToEntityRow } from '~/src/app/services/transformers/transform-service-to-entity-row'

const serviceListController = {
  handler: async (request, h) => {
    const services = await fetchServices()
    const entityRows = services
      .sort(sortBy('timestamp'))
      .map(transformServiceToEntityRow)

    return h.view('services/views/list', {
      pageTitle: 'Services',
      heading: 'Services',
      entityRows
    })
  }
}

export { serviceListController }
