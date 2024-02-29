import Joi from 'joi'
import Boom from '@hapi/boom'

import { serviceStatus } from '~/src/server/services/transformers/service-status'
import { provideServiceCreateStatus } from '~/src/server/common/helpers/pre/provide-service-create-status'
import { serviceToEntityDataList } from '~/src/server/services/transformers/service-to-entity-data-list'

const serviceStatusController = {
  options: {
    pre: [provideServiceCreateStatus],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const service = request.pre.service

    if (!service) {
      return null
    }

    const creationJob = serviceStatus(service)
    const isSuccess = creationJob?.status?.isSuccess
    const creationPosition = isSuccess ? 'Created' : 'Creating'
    const serviceName = service.serviceName
    const pageTitle = `${creationPosition} ${serviceName} microservice`
    const caption = `${creationPosition} the ${serviceName} microservice.`

    return h.view('services/views/service-status', {
      pageTitle,
      creationJob,
      isSuccess,
      heading: serviceName,
      caption,
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

export { serviceStatusController }
