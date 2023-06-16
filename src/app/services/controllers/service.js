import { startCase } from 'lodash'

import { appConfig } from '~/src/config'
import { fetchRepository } from '~/src/app/services/helpers/fetch-repository'
import { transformServiceToEntityDataList } from '~/src/app/services/transformers/transform-service-to-entity-data-list'

const serviceController = {
  handler: async (request, h) => {
    // TODO swap this over to deployables
    const { repository } = await fetchRepository(request.params.serviceId)

    return h.view('services/views/service', {
      pageTitle: `${repository.id} service`,
      // TODO we have an issue when repo name and image name are different. Use Deployments as the source not GitHub
      heading: startCase(repository.id),
      entityDataList: transformServiceToEntityDataList(repository),
      service: repository,
      breadcrumbs: [
        {
          text: 'Services',
          href: `${appConfig.get('appPathPrefix')}/services`
        },
        {
          text: repository.id
        }
      ]
    })
  }
}

export { serviceController }
