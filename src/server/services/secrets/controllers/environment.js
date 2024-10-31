import Boom from '@hapi/boom'
import kebabCase from 'lodash/kebabCase.js'
import upperFirst from 'lodash/upperFirst.js'

import { fetchSecrets } from '~/src/server/common/helpers/fetch/fetch-secrets.js'
import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { environmentSecrets } from '~/src/server/services/secrets/transformers/environment-secrets.js'
import { secretParamsValidation } from '~/src/server/services/secrets/helpers/schema/secret-params-validation.js'

const environmentSecretsController = {
  options: {
    id: 'services/{serviceId}/secrets/{environment}',
    pre: [provideService],
    validate: {
      params: secretParamsValidation,
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
      exceptionMessage,
      isSecretsSetup
    } = environmentSecrets(secrets)

    return h.view('services/secrets/views/environment', {
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
      isSecretsSetup,
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
