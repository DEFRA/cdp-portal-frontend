import Joi from 'joi'
import Boom from '@hapi/boom'
import { compose } from 'lodash/fp'
import { startCase } from 'lodash'

import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { transformStatus } from '~/src/server/services/transformers/transform-status'
import { fetchRunningServicesById } from '~/src/server/services/helpers/fetch-running-services-by-id'
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
    const breadcrumbs = [
      {
        text: 'Services',
        href: '/services'
      },
      {
        text: service.serviceName
      }
    ]

    // TODO tidy up these being in the same file
    if (!service?.serviceStatus) {
      const runningServices = await fetchRunningServicesById(serviceId)

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
        breadcrumbs
      })
    }

    if (service.serviceStatus) {
      return h.view('services/views/service-status', {
        pageTitle: `${service.serviceName} service`,
        heading: startCase(service.serviceName),
        entityDataList: transformServiceToEntityDataList(service),
        creationJob: transformStatus(service.serviceStatus),
        service,
        breadcrumbs
      })
    }
  }
}

export { serviceController }
