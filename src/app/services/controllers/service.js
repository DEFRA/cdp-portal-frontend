import { startCase } from 'lodash'

import { appConfig } from '~/src/config'
import { fetchService } from '~/src/app/services/helpers/fetch-service'
import { transformServiceToHeadingEntities } from '~/src/app/services/transformers/transform-service-to-heading-entities'

const serviceController = {
  handler: async (request, h) => {
    const { service } = await fetchService(request.params.serviceId)

    return h.view('services/views/service', {
      pageTitle: `${service.id} service`,
      heading: startCase(service.id),
      service,
      serviceUrlText: service.url && `https://snd.${service.id}.defra.gov.uk`,
      headingEntities: transformServiceToHeadingEntities(service),
      breadcrumbs: [
        {
          text: 'Services',
          href: `${appConfig.get('appPathPrefix')}/services`
        },
        {
          text: startCase(service.id)
        }
      ]
    })
  }
}

export { serviceController }
