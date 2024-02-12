import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideServiceCreateStatus } from '~/src/server/services/helpers/pre/provide-service-create-status'
import { transformServiceToEntityDataList } from '~/src/server/common/transformers/transform-service-to-entity-data-list'
import { transformEnvTestSuiteStatus } from '~/src/server/services/transformers/transform-env-test-suite-status'

const envTestSuiteStatusController = {
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

    const creationJob = transformEnvTestSuiteStatus(service)
    const isSuccess = creationJob?.status?.isSuccess
    const creationPosition = isSuccess ? 'Created' : 'Creating'
    const serviceName = service.serviceName
    const pageTitle = `${creationPosition} ${serviceName} environment test suite`
    const caption = `${creationPosition} the ${serviceName} environment test suite.`

    return h.view('services/views/env-test-suite-status', {
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

export { envTestSuiteStatusController }
