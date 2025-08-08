import Boom from '@hapi/boom'

import { formatText } from '../../../../../config/nunjucks/filters/filters.js'
import { fetchBuckets } from '../../../../common/helpers/fetch/fetch-buckets.js'
import { serviceParamsValidation } from '../../../helpers/schema/service-params-validation.js'
import { environmentResources } from '../transformers/environment-resources.js'

const environmentResourcesController = {
  options: {
    id: 'services/{serviceId}/resources/{environment}',
    validate: {
      params: serviceParamsValidation,
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const environment = request.params.environment
    const entity = request.app.entity
    const serviceName = entity.name
    const team = entity?.teams?.at(0)
    const teamId = team?.teamId
    const formattedEnvironment = formatText(environment)
    const bucketsForEnv = await fetchBuckets(environment, serviceName)

    const { buckets, isBucketsSetup } = environmentResources(bucketsForEnv)

    return h.view('services/service/resources/views/environment', {
      pageTitle: `${serviceName} - Resources - ${formattedEnvironment}`,
      entity,
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
          text: 'Resources',
          href: `/services/${serviceName}/resources`
        },
        {
          text: formattedEnvironment
        }
      ]
    })
  }
}

export { environmentResourcesController }
