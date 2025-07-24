import Joi from 'joi'
import Boom from '@hapi/boom'
import startCase from 'lodash/startCase.js'

import { fetchAllSecrets } from '../../../../../../services/helpers/fetch/fetch-all-secrets.js'
import { allEnvironmentSecrets } from '../transformers/all-environment-secrets.js'
import { getEnvironments } from '../../../../../helpers/environments/get-environments.js'
import { pluralise } from '../../../../../helpers/pluralise.js'

function allSecretsController(entityType) {
  return {
    options: {
      id: `${pluralise(entityType)}/{serviceId}/secrets`,
      validate: {
        params: Joi.object({
          serviceId: Joi.string().required()
        }),
        failAction: () => Boom.boomify(Boom.notFound())
      }
    },
    handler: async (request, h) => {
      const entityName = request.params.serviceId
      const environments = getEnvironments(request.auth.credentials?.scope)
      const allSecrets = await fetchAllSecrets(entityName)
      const secretsByEnvironment = allEnvironmentSecrets(
        environments,
        allSecrets
      )

      return h.view('common/patterns/entities/tabs/secrets/views/all', {
        pageTitle: `${entityName} - Secrets`,
        entityName,
        secretsByEnvironment,
        entityType,
        breadcrumbs: [
          {
            text: `${startCase(pluralise(entityType))}`,
            href: `/${pluralise(entityType)}`
          },
          {
            text: entityName,
            href: `/${pluralise(entityType)}/${entityName}`
          },
          {
            text: 'Secrets'
          }
        ]
      })
    }
  }
}

export { allSecretsController }
