import Boom from '@hapi/boom'
import startCase from 'lodash/startCase.js'

import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { fetchSecrets } from '~/src/server/common/helpers/fetch/fetch-secrets.js'
import { environmentSecrets } from '~/src/server/common/patterns/entities/tabs/secrets/transformers/environment-secrets.js'
import { serviceParamsValidation } from '~/src/server/services/helpers/schema/service-params-validation.js'
import { pluralise } from '~/src/server/common/helpers/pluralise.js'

export function environmentSecretsController(serviceOrTestSuite) {
  return {
    options: {
      id: `${pluralise(serviceOrTestSuite)}/{serviceId}/secrets/{environment}`,
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
      const secrets = await fetchSecrets(environment, serviceName)

      const {
        serviceSecrets,
        platformSecrets,
        shouldPoll,
        successMessage,
        exceptionMessage
      } = environmentSecrets(secrets)

      return h.view('common/patterns/entities/tabs/secrets/views/environment', {
        pageTitle: `${serviceName} - Secrets - ${formattedEnvironment}`,
        service,
        teamId,
        environment,
        platformSecrets,
        serviceSecrets,
        shouldPoll,
        successMessage,
        exceptionMessage,
        serviceOrTestSuite,
        breadcrumbs: [
          {
            text: `${pluralise(startCase(serviceOrTestSuite))}`,
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
