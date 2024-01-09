import Joi from 'joi'
import Boom from '@hapi/boom'
import { compose } from 'lodash/fp'

import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { fetchRunningServicesById } from '~/src/server/services/helpers/fetch/fetch-running-services-by-id'
import { transformWithEnvironments } from '~/src/server/common/transformers/transform-with-environments'
import { transformServiceToEntityDataList } from '~/src/server/services/transformers/transform-service-to-entity-data-list'
import { transformRunningServicesToEntityRow } from '~/src/server/services/transformers/transform-running-services-to-entity-row'

const serviceController = {
  options: {
    pre: [provideService],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params?.serviceId
    const service = request.pre.service

    const runningServices = await fetchRunningServicesById(serviceId)
    const runningServicesEntityRows = compose(
      transformRunningServicesToEntityRow,
      transformWithEnvironments
    )(runningServices)

    return h.view('services/views/service', {
      pageTitle: `${service.serviceName} microservice`,
      runningServicesEntityRows,
      runningEnvironmentsMap: runningServices.reduce(
        (environmentsMap, runningService) => ({
          ...environmentsMap,
          [runningService.environment]: true
        }),
        {}
      ),
      heading: service.serviceName,
      entityDataList: transformServiceToEntityDataList(service),
      service,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: service.serviceName
        }
      ]
    })
  }
}

export { serviceController }
