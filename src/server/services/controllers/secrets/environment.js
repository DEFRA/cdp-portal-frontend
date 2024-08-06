import Joi from 'joi'
import Boom from '@hapi/boom'
import { kebabCase, upperFirst } from 'lodash'

import { scopes } from '~/src/server/common/constants/scopes'
import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope'
import { fetchSecrets } from '~/src/server/common/helpers/fetch/fetch-secrets'
import { environmentSecrets } from '~/src/server/services/transformers/secrets/environment-secrets'

const environmentSecretsController = {
  options: {
    id: 'services/{serviceId}/secrets/{environment}',
    ext: {
      onCredentials: addServiceOwnerScope()
    },
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.serviceOwner]
      }
    },
    pre: [provideService],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        environment: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const environment = request.params.environment
    const service = request.pre.service
    const serviceName = service.serviceName
    const team = service?.teams?.at(0)
    const teamId = team?.teamId
    const formattedEnvironment = upperFirst(kebabCase(environment))
    const secrets = await fetchSecrets(environment, serviceName)

    const {
      serviceSecrets,
      platformSecrets,
      shouldPoll,
      successMessage,
      exceptionMessage
    } = environmentSecrets(secrets)

    return h.view('services/views/secrets/environment', {
      pageTitle: `${serviceName} - Secrets - ${formattedEnvironment}`,
      heading: serviceName,
      service,
      teamId,
      environment,
      platformSecrets,
      serviceSecrets,
      shouldPoll,
      successMessage,
      exceptionMessage,
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
          text: formattedEnvironment
        }
      ]
    })
  }
}

export { environmentSecretsController }
