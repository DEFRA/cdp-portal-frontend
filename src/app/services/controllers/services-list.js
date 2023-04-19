import { fetchServicesList } from '~/src/app/services/helpers/fetch-services-list'
import { sortByTimestamp } from '~/src/common/helpers/sort-by-timestamp'
import { transformServicesToEntities } from '~/src/app/services/transformers/transform-services-to-entities'

const servicesListController = {
  handler: async (request, h) => {
    const services = await fetchServicesList()
    const servicesEntityList = services
      .sort(sortByTimestamp())
      .map(transformServicesToEntities)

    return h.view('services/views/services-list', {
      pageTitle: 'Services',
      heading: 'Services',
      items: servicesEntityList
    })
  }
}

export { servicesListController }
