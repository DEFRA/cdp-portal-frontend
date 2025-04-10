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
      const service = request.app.service
      const team = service?.teams?.at(0)
      const teamId = team?.teamId
      const serviceName = service.serviceName
      const environment = request.params?.environment
      const secretKey = request.query?.secretKey
      const formattedEnvironment = formatText(environment)

      return h.view('common/tabs/secrets/views/update-form', {
        pageTitle: `${serviceName} - Update secret`,
        heading: serviceName,
        service,
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
            text: serviceName,
            href: `/${pluralise(serviceOrTestSuite)}/${serviceName}`
          },
          {
            text: 'Secrets',
            href: `/${pluralise(serviceOrTestSuite)}/${serviceName}/secrets`
          },
          {
            text: formattedEnvironment,
            href: `/${pluralise(serviceOrTestSuite)}/${serviceName}/secrets/${environment}`
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
