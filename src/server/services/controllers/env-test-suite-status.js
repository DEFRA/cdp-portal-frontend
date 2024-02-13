import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideServiceCreateStatus } from '~/src/server/services/helpers/pre/provide-service-create-status'
import { serviceToEntityDataList } from '~/src/server/common/transformers/service-to-entity-data-list'
import { envTestSuiteStatus } from '~/src/server/services/transformers/env-test-suite-status'

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

    const creationJob = envTestSuiteStatus(service)
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

export { envTestSuiteStatusController }
