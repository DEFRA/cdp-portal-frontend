import Joi from 'joi'
import Boom from '@hapi/boom'
import { compose } from 'lodash/fp'

import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { fetchRunningServicesById } from '~/src/server/services/helpers/fetch/fetch-running-services-by-id'
import { withEnvironments } from '~/src/server/common/transformers/with-environments'
import { runningServicesToEntityRow } from '~/src/server/services/transformers/running-services-to-entity-row'
import { serviceToEntityDataList } from '~/src/server/common/transformers/service-to-entity-data-list'

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
      runningServicesToEntityRow,
      withEnvironments
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
      entityDataList: serviceToEntityDataList(service),
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
