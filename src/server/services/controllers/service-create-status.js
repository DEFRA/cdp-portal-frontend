import Joi from 'joi'
import Boom from '@hapi/boom'

import { transformStatus } from '~/src/server/services/transformers/transform-status'
import { provideServiceCreateStatus } from '~/src/server/services/helpers/pre/provide-service-create-status'
import { transformServiceToEntityDataList } from '~/src/server/services/transformers/transform-service-to-entity-data-list'

const serviceCreateStatusController = {
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

    const creationJob = transformStatus(service)
    const isSuccess = creationJob?.status?.isSuccess
    const creationPosition = isSuccess ? 'Created' : 'Creating'
    const serviceName = service.serviceName
    const pageTitle = `${creationPosition} ${serviceName} microservice`
    const caption = `${creationPosition} the ${serviceName} microservice.`

    return h.view('services/views/service-create-status', {
      pageTitle,
      creationJob,
      isSuccess,
      heading: serviceName,
      caption,
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

export { serviceCreateStatusController }
