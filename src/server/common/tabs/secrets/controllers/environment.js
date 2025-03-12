import Boom from '@hapi/boom'

import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { fetchSecrets } from '~/src/server/common/helpers/fetch/fetch-secrets.js'
import { preProvideService } from '~/src/server/services/helpers/pre/pre-provide-service.js'
import { environmentSecrets } from '~/src/server/common/tabs/secrets/transformers/environment-secrets.js'
import { serviceParamsValidation } from '~/src/server/services/helpers/schema/service-params-validation.js'
import startCase from 'lodash/startCase.js'
import { pluralise } from '~/src/server/common/helpers/pluralise.js'

export function environmentSecretsController(serviceOrTestSuite) {
  return {
    options: {
      id: `${pluralise(serviceOrTestSuite)}/{serviceId}/secrets/{environment}`,
      pre: [preProvideService],
      validate: {
        params: serviceParamsValidation,
        failAction: () => Boom.boomify(Boom.notFound())
      }
    },
    handler: async (request, h) => {
      const environment = request.params.environment
      const service = request.pre.service
      const serviceName = service.serviceName
      const team = service?.teams?.at(0)
      const teamId = team?.teamId
      const formattedEnvironment = formatText(environment)
      const secrets = await fetchSecrets(environment, serviceName)

      const {
        serviceSecrets,
        platformSecrets,
        shouldPoll,
        successMessage,
        exceptionMessage,
        isSecretsSetup
      } = environmentSecrets(secrets)

      return h.view('common/tabs/secrets/views/environment', {
        pageTitle: `${serviceName} - Secrets - ${formattedEnvironment}`,
        service,
        teamId,
        environment,
        platformSecrets,
        serviceSecrets,
        shouldPoll,
        successMessage,
        exceptionMessage,
        isSecretsSetup,
        serviceOrTestSuite,
        breadcrumbs: [
          {
            text: `${startCase(serviceOrTestSuite)}s`,
            href: `/${pluralise(serviceOrTestSuite)}`
          },
          {
            text: serviceName,
            href: `/${pluralise(serviceOrTestSuite)}/${serviceName}`
          },
          {
            text: 'Secrets',
            href: `/${pluralise(serviceOrTestSuite)}/${serviceName}/secrets`
          },
          {
            text: formattedEnvironment
          }
        ]
      })
    }
  }
}
