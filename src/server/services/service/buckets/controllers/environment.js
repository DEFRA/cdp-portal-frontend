import Boom from '@hapi/boom'

import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { fetchBuckets } from '~/src/server/common/helpers/fetch/fetch-buckets.js'
import { environmentBuckets } from '~/src/server/services/service/buckets/transformers/environment-buckets.js'
import { serviceParamsValidation } from '~/src/server/services/helpers/schema/service-params-validation.js'

const environmentBucketsController = {
  options: {
    id: 'services/{serviceId}/buckets/{environment}',
    validate: {
      params: serviceParamsValidation,
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const environment = request.params.environment
    const service = request.app.service
    const serviceName = service.serviceName
    const team = service?.teams?.at(0)
    const teamId = team?.teamId
    const formattedEnvironment = formatText(environment)
    const bucketsForEnv = await fetchBuckets(environment, serviceName)

    const { buckets, isBucketsSetup } = environmentBuckets(bucketsForEnv)

    return h.view('services/service/buckets/views/environment', {
      pageTitle: `${serviceName} - Buckets - ${formattedEnvironment}`,
      service,
      teamId,
      environment,
      buckets,
      isBucketsSetup,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: serviceName,
          href: `/services/${serviceName}`
        },
        {
          text: 'Buckets',
          href: `/services/${serviceName}/buckets`
        },
        {
          text: formattedEnvironment
        }
      ]
    })
  }
}

export { environmentBucketsController }
