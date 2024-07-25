import Joi from 'joi'
import Boom from '@hapi/boom'
import { kebabCase, pullAll, upperFirst } from 'lodash'

import { config } from '~/src/config'
import { scopes } from '~/src/server/common/constants/scopes'
import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { buildRunningServicesRowHeadings } from '~/src/server/common/helpers/build-running-services-row-headings'
import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope'
import { fetchSecrets } from '~/src/server/deploy-service/helpers/fetch/fetch-secrets'
import { platformGlobalSecretKeysDescriptions } from '~/src/server/common/constants/platform-global-secret-keys-descriptions'
import { noValue } from '~/src/server/common/constants/no-value'

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
    const environments = getEnvironmentsByTeam(service.teams)
    const formattedEnvironment = upperFirst(kebabCase(environment))

    const secrets = await fetchSecrets(environment, serviceName)
    const platformGlobalSecretKeys = config.get('platformGlobalSecretKeys')
    const serviceSecrets = {
      ...secrets,
      keys: secrets?.keys
        ? pullAll(
            [...secrets.keys],
            [...platformGlobalSecretKeys, 'automated_placeholder']
          )
        : []
    }
    const platformSecrets = platformGlobalSecretKeys
      .map((key) => {
        if (secrets?.keys?.includes(key)) {
          return {
            key,
            description: platformGlobalSecretKeysDescriptions[key] ?? noValue
          }
        }

        return null
      })
      .filter(Boolean)

    return h.view('services/views/secrets/environment', {
      pageTitle: `${serviceName} - Secrets - ${formattedEnvironment}`,
      heading: serviceName,
      rowHeadings: buildRunningServicesRowHeadings(environments),
      service,
      teamId,
      environment,
      platformSecrets,
      serviceSecrets,
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
