import Joi from 'joi'
import Boom from '@hapi/boom'
import startCase from 'lodash/startCase.js'

import { fetchAllSecrets } from '../../../../../../services/helpers/fetch/fetch-all-secrets.js'
import { allEnvironmentSecrets } from '../transformers/all-environment-secrets.js'
import { getEnvironments } from '../../../../../helpers/environments/get-environments.js'
import { pluralise } from '../../../../../helpers/pluralise.js'

function allSecretsController(entityKind) {
  return {
    options: {
      id: `${pluralise(entityKind)}/{serviceId}/secrets`,
      validate: {
        params: Joi.object({
          serviceId: Joi.string().required()
        }),
        failAction: () => Boom.boomify(Boom.notFound())
      }
    },
    handler: async (request, h) => {
      const entity = request.app.entity
      const entityName = request.params.serviceId
      const environments = getEnvironments(
        request.auth.credentials?.scope,
        entity?.subType
      )
      const allSecrets = await fetchAllSecrets(entityName)
      const secretsByEnvironment = allEnvironmentSecrets(
        environments,
        allSecrets
      )

      return h.view('common/patterns/entities/tabs/secrets/views/all', {
        pageTitle: `${entityName} - Secrets`,
        entityName,
        secretsByEnvironment,
        entityKind,
        breadcrumbs: [
          {
            text: `${startCase(pluralise(entityKind))}`,
            href: `/${pluralise(entityKind)}`
          },
          {
            text: entityName,
            href: `/${pluralise(entityKind)}/${entityName}`
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
