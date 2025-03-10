import Joi from 'joi'
import Boom from '@hapi/boom'

import { preProvideService } from '~/src/server/services/helpers/pre/pre-provide-service.js'
import { fetchAllSecrets } from '~/src/server/services/helpers/fetch/fetch-all-secrets.js'
import { allEnvironmentSecrets } from '~/src/server/services/service/secrets/transformers/all-environment-secrets.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'

const allSecretsController = {
  options: {
    id: 'services/{serviceId}/secrets',
    pre: [preProvideService],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const service = request.pre.service
    const serviceName = service.serviceName
    const environments = getEnvironments(request.auth.credentials?.scope)
    const allSecrets = await fetchAllSecrets(serviceName)
    const secretsByEnvironment = allEnvironmentSecrets(environments, allSecrets)

    return h.view('services/service/secrets/views/all', {
      pageTitle: `${serviceName} - Secrets`,
      service,
      secretsByEnvironment,
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
          text: 'Secrets'
        }
      ]
    })
  }
}

export { allSecretsController }
