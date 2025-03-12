import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '~/src/config/config.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { fetchSecrets } from '~/src/server/common/helpers/fetch/fetch-secrets.js'
import { preProvideService } from '~/src/server/services/helpers/pre/pre-provide-service.js'
import { serviceParamsValidation } from '~/src/server/services/helpers/schema/service-params-validation.js'
import startCase from 'lodash/startCase.js'

const immutableKeys = config.get('platformGlobalSecretKeys')

function updateSecretFormController(serviceOrTestSuite) {
  return {
    options: {
      id: `${serviceOrTestSuite}s/{serviceId}/secrets/{environment}/update`,
      pre: [preProvideService],
      validate: {
        params: serviceParamsValidation,
        query: Joi.object({
          secretKey: Joi.string()
            .not(...immutableKeys)
            .min(1)
            .max(256)
            .required()
        }),
        failAction: () => Boom.boomify(Boom.notFound())
      }
    },
    handler: async (request, h) => {
      const service = request.pre.service
      const team = service?.teams?.at(0)
      const teamId = team?.teamId
      const serviceName = service.serviceName
      const environment = request.params?.environment
      const secretKey = request.query?.secretKey
      const formattedEnvironment = formatText(environment)
      const secrets = await fetchSecrets(environment, serviceName)

      return h.view('services/service/secrets/views/update-form', {
        pageTitle: `${serviceName} - Update secret`,
        heading: serviceName,
        service,
        teamId,
        environment,
        secretKey,
        isSecretsSetup: secrets !== null,
        serviceOrTestSuite,
        breadcrumbs: [
          {
            text: `${startCase(serviceOrTestSuite)}s`,
            href: `/${serviceOrTestSuite}s`
          },
          {
            text: serviceName,
            href: `/${serviceOrTestSuite}s/${serviceName}`
          },
          {
            text: 'Secrets',
            href: `/${serviceOrTestSuite}s/${serviceName}/secrets`
          },
          {
            text: formattedEnvironment,
            href: `/${serviceOrTestSuite}s/${serviceName}/secrets/${environment}`
          },
          {
            text: `Update secret`
          }
        ]
      })
    }
  }
}

export { updateSecretFormController }
