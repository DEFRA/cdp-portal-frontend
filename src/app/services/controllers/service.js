import { config } from '~/src/config'
import { fetchService } from '~/src/app/services/helpers/fetch-service'
import { transformServiceToHeadingEntities } from '~/src/app/services/transformers/transform-service-to-heading-entities'

const serviceController = {
  handler: async (request, h) => {
    const service = await fetchService(request.params.serviceId)

    return h.view('services/views/service', {
      pageTitle: `${service.serviceName} Service`,
      heading: service.serviceName,
      service,
      headingEntities: transformServiceToHeadingEntities(service),
      breadcrumbs: [
        {
          text: 'Repositories',
          href: `${config.get('appPathPrefix')}/services`
        },
        {
          text: service.serviceName
        }
      ]
    })
  }
}

export { serviceController }
