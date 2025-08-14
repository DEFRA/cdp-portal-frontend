import Joi from 'joi'
import Boom from '@hapi/boom'
import startCase from 'lodash/startCase.js'

import { config } from '../../../../../../../config/config.js'
import { formatText } from '../../../../../../../config/nunjucks/filters/filters.js'
import { serviceParamsValidation } from '../../../../../../services/helpers/schema/service-params-validation.js'
import { pluralise } from '../../../../../helpers/pluralise.js'

const immutableKeys = config.get('platformGlobalSecretKeys')

function updateSecretFormController(entityKind) {
  return {
    options: {
      id: `${pluralise(entityKind)}/{serviceId}/secrets/{environment}/update`,
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
            text: formattedEnvironment,
            href: `/${pluralise(entityKind)}/${entityName}/secrets/${environment}`
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
