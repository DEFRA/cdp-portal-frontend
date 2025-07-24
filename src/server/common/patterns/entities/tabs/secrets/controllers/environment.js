import Boom from '@hapi/boom'
import startCase from 'lodash/startCase.js'

import { formatText } from '../../../../../../../config/nunjucks/filters/filters.js'
import { fetchSecrets } from '../../../../../helpers/fetch/fetch-secrets.js'
import { environmentSecrets } from '../transformers/environment-secrets.js'
import { serviceParamsValidation } from '../../../../../../services/helpers/schema/service-params-validation.js'
import { pluralise } from '../../../../../helpers/pluralise.js'

export function environmentSecretsController(entityType) {
  return {
    options: {
      id: `${pluralise(entityType)}/{serviceId}/secrets/{environment}`,
      validate: {
        params: serviceParamsValidation,
        failAction: () => Boom.boomify(Boom.notFound())
      }
    },
    handler: async (request, h) => {
      const environment = request.params.environment
      const entityName = request.params.serviceId
      const teamId = request.app?.entity?.teams?.at(0)?.teamId
      const formattedEnvironment = formatText(environment)
      const secrets = await fetchSecrets(environment, entityName)

      const {
        serviceSecrets,
        platformSecrets,
        shouldPoll,
        successMessage,
        exceptionMessage
      } = environmentSecrets(secrets)

      return h.view('common/patterns/entities/tabs/secrets/views/environment', {
        pageTitle: `${entityName} - Secrets - ${formattedEnvironment}`,
        entityName,
        teamId,
        environment,
        platformSecrets,
        serviceSecrets,
        shouldPoll,
        successMessage,
        exceptionMessage,
        entityType,
        breadcrumbs: [
          {
            text: `${pluralise(startCase(entityType))}`,
            href: `/${pluralise(entityType)}`
          },
          {
            text: entityName,
            href: `/${pluralise(entityType)}/${entityName}`
          },
          {
            text: 'Secrets',
            href: `/${pluralise(entityType)}/${entityName}/secrets`
          },
          {
            text: formattedEnvironment
          }
        ]
      })
    }
  }
}
