import Joi from 'joi'
import Boom from '@hapi/boom'
import startCase from 'lodash/startCase.js'

import { config } from '~/src/config/config.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { serviceParamsValidation } from '~/src/server/services/helpers/schema/service-params-validation.js'
import { pluralise } from '~/src/server/common/helpers/pluralise.js'

const immutableKeys = config.get('platformGlobalSecretKeys')

function updateSecretFormController(serviceOrTestSuite) {
  return {
    options: {
      id: `${pluralise(serviceOrTestSuite)}/{serviceId}/secrets/{environment}/update`,
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
      const entity = request.app.entity
      const team = entity?.teams?.at(0)
      const teamId = team?.teamId
      const entityName = entity.name
      const environment = request.params?.environment
      const secretKey = request.query?.secretKey
      const formattedEnvironment = formatText(environment)

      return h.view('common/patterns/entities/tabs/secrets/views/update-form', {
        pageTitle: `${entityName} - Update secret`,
        heading: entityName,
        entity,
        teamId,
        environment,
        secretKey,
        serviceOrTestSuite,
        breadcrumbs: [
          {
            text: `${pluralise(startCase(serviceOrTestSuite))}`,
            href: `/${pluralise(serviceOrTestSuite)}`
          },
          {
            text: entityName,
            href: `/${pluralise(serviceOrTestSuite)}/${entityName}`
          },
          {
            text: 'Secrets',
            href: `/${pluralise(serviceOrTestSuite)}/${entityName}/secrets`
          },
          {
            text: formattedEnvironment,
            href: `/${pluralise(serviceOrTestSuite)}/${entityName}/secrets/${environment}`
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
