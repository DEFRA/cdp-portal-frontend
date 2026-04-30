import Boom from '@hapi/boom'

import { formatText } from '#config/nunjucks/filters/filters.js'
import { serviceParamsValidation } from '../../../helpers/schema/service-params-validation.js'
import Joi from 'joi'
import { fetchResources } from '../../../helpers/fetch/fetch-resources.js'

export const environmentResourcesController = {
  options: {
    id: 'services/{serviceId}/resources/{environment}',
    validate: {
      query: Joi.object().keys({
        debug: Joi.boolean().default(false)
      }),
      params: serviceParamsValidation,
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { environment } = request.params
    const { entity } = request.app
    const serviceName = entity.name

    const team = entity?.teams?.at(0)
    const teamId = team?.teamId
    const formattedEnvironment = formatText(environment)

    const resources = await fetchResources(entity.name, environment)

    resources.bedrock_ai = [
      {
        name: 'bob',
        properties: {
          guardrail: {
            arn: 'arn:aws:bedrock:eu-west-2:506190012364:guardrail/2l4jixq4m3zd',
            name: 'custom',
            version: ''
          }
        }
      }
    ]

    const hasNoResources = !Object.entries(resources).find(
      ([_, items]) => items?.length
    )

    return h.view('services/service/resources/views/environment', {
      pageTitle: `${serviceName} - Resources - ${formattedEnvironment}`,
      entity,
      teamId,
      environment,
      resources,
      hasNoResources,
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
