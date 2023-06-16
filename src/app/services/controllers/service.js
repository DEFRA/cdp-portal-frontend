import { startCase } from 'lodash'

import { appConfig } from '~/src/config'
import { fetchService } from '~/src/app/services/helpers/fetch-service'
import { transformServiceToEntityDataList } from '~/src/app/services/transformers/transform-service-to-entity-data-list'

const serviceController = {
  handler: async (request, h) => {
    const response = await fetchService(request.params.serviceId)
    const service = response.repository

    return h.view('services/views/service', {
      pageTitle: `${service.id} service`,
      // TODO we have an issue when repo name and image name are different. Use Deployments as the source not GitHub
      heading: startCase(service.id),
      entityDataList: transformServiceToEntityDataList(service),
      service,
      breadcrumbs: [
        {
          text: 'Services',
          href: `${appConfig.get('appPathPrefix')}/services`
        },
        {
          text: service.id
        }
      ]
    })
  }
}

export { serviceController }
