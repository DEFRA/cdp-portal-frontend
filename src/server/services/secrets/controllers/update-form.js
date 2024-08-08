import Joi from 'joi'
import Boom from '@hapi/boom'
import { kebabCase, upperFirst } from 'lodash'

import { config } from '~/src/config'
import { fetchSecrets } from '~/src/server/common/helpers/fetch/fetch-secrets'
import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { secretParamsValidation } from '~/src/server/services/secrets/helpers/schema/secret-params-validation'

const immutableKeys = config.get('platformGlobalSecretKeys')

const updateSecretFormController = {
  options: {
    id: 'services/{serviceId}/secrets/{environment}/update',
    pre: [provideService],
    validate: {
      params: secretParamsValidation,
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
  handler: async (request, h) => {
    const service = request.pre.service
    const team = service?.teams?.at(0)
    const teamId = team?.teamId
    const serviceName = service.serviceName
    const environment = request.params?.environment
    const secretKey = request.query?.secretKey
    const formattedEnvironment = upperFirst(kebabCase(environment))
    const secrets = await fetchSecrets(environment, serviceName)

    return h.view('services/secrets/views/update-form', {
      pageTitle: `${serviceName} - Update secret`,
      heading: serviceName,
      service,
      teamId,
      environment,
      secretKey,
      isSecretsSetup: secrets !== null,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: serviceName,
          href: `/services/${serviceName}`
        },
        {
          text: 'Secrets',
          href: `/services/${serviceName}/secrets`
        },
        {
          text: formattedEnvironment,
          href: `/services/${serviceName}/secrets/${environment}`
        },
        {
          text: `Update secret`
        }
      ]
    })
  }
}

export { updateSecretFormController }
