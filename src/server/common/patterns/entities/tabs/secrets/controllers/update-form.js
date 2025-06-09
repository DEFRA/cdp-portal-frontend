import Joi from 'joi'
import Boom from '@hapi/boom'
import startCase from 'lodash/startCase.js'

import { config } from '~/src/config/config.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { serviceParamsValidation } from '~/src/server/services/helpers/schema/service-params-validation.js'
import { pluralise } from '~/src/server/common/helpers/pluralise.js'

const immutableKeys = config.get('platformGlobalSecretKeys')

function updateSecretFormController(entityType) {
  return {
    options: {
      id: `${pluralise(entityType)}/{serviceId}/secrets/{environment}/update`,
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
    handler: (request, h) => {
      const teamId = request.app.entity?.teams?.at(0)?.teamId
      const entityName = request.params.serviceId
      const environment = request.params?.environment
      const secretKey = request.query?.secretKey
      const formattedEnvironment = formatText(environment)

      return h.view('common/patterns/entities/tabs/secrets/views/update-form', {
        pageTitle: `${entityName} - Update secret`,
        heading: entityName,
        entityName,
        teamId,
        environment,
        secretKey,
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
            text: formattedEnvironment,
            href: `/${pluralise(entityType)}/${entityName}/secrets/${environment}`
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
