import Boom from '@hapi/boom'
import startCase from 'lodash/startCase.js'

import { formatText } from '../../../../../../../config/nunjucks/filters/filters.js'
import { fetchSecrets } from '../../../../../helpers/fetch/fetch-secrets.js'
import { environmentSecrets } from '../transformers/environment-secrets.js'
import { serviceParamsValidation } from '../../../../../../services/helpers/schema/service-params-validation.js'
import { pluralise } from '../../../../../helpers/pluralise.js'

export function environmentSecretsController(entityKind) {
  return {
    options: {
      id: `${pluralise(entityKind)}/{serviceId}/secrets/{environment}`,
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
        entityKind,
        breadcrumbs: [
          {
            text: `${pluralise(startCase(entityKind))}`,
            href: `/${pluralise(entityKind)}`
          },
          {
            text: entityName,
            href: `/${pluralise(entityKind)}/${entityName}`
          },
          {
            text: 'Secrets',
            href: `/${pluralise(entityKind)}/${entityName}/secrets`
          },
          {
            text: formattedEnvironment
          }
        ]
      })
    }
  }
}
