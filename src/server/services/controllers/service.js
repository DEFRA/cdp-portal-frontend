import Boom from '@hapi/boom'
import { compose } from 'lodash/fp'
import { omit, startCase } from 'lodash'

import { appConfig } from '~/src/config'
import { fetchRepository } from '~/src/server/services/helpers/fetch-repository'
import { transformServiceToEntityDataList } from '~/src/server/services/transformers/transform-service-to-entity-data-list'
import { fetchDeployableService } from '~/src/server/services/helpers/fetch-deployable-service'
import { fetchRunningServicesById } from '~/src/server/services/helpers/fetch-running-services-by-id'
import { transformWithEnvironments } from '~/src/server/common/transformers/transform-with-environments'
import { transformRunningServicesToEntityRow } from '~/src/server/services/transformers/transform-running-services-to-entity-row'

const serviceController = {
  handler: async (request, h) => {
    try {
      const serviceId = request.params?.serviceId
      const deployableService = await fetchDeployableService(serviceId)

      const repositoryId = deployableService?.githubUrl?.split('/')?.at(-1)
      const { repository } = await fetchRepository(repositoryId)

      const runningServices = await fetchRunningServicesById(serviceId)

      const service = omit(
        {
          ...deployableService,
          ...repository
        },
        ['url', 'id']
      )

      const runningServicesEntityRows = compose(
        transformRunningServicesToEntityRow,
        transformWithEnvironments
      )(runningServices)

      return h.view('services/views/service', {
        pageTitle: `${service.serviceName} service`,
        heading: startCase(service.serviceName),
        entityDataList: transformServiceToEntityDataList(service),
        runningServicesEntityRows,
        service,
        // TODO move breadcrumbs to onPostHandler
        breadcrumbs: [
          {
            text: 'Services',
            href: `${appConfig.get('appPathPrefix')}/services`
          },
          {
            text: service.serviceName
          }
        ]
      })
    } catch (error) {
      return Boom.boomify(error)
    }
  }
}

export { serviceController }
