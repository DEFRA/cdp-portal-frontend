import { fetchServicesList } from '~/src/app/services/helpers/fetch-services-list'

const servicesListController = {
  handler: async (request, h) => {
    const services = await fetchServicesList()

    return h.view('services/views/services-list', {
      pageTitle: 'Services',
      heading: 'Services',
      services
    })
  }
}

export { servicesListController }
