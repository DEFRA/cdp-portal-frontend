import { fetchService } from '~/src/app/services/helpers/fetch-service'

const serviceController = {
  handler: async (request, h) => {
    const service = await fetchService(request.params.serviceId)

    return h.view('services/views/service', {
      pageTitle: `${service.serviceName} Service`,
      heading: service.serviceName,
      service,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/cdp-portal-frontend/services'
        },
        {
          text: service.serviceName
        }
      ]
    })
  }
}

export { serviceController }
