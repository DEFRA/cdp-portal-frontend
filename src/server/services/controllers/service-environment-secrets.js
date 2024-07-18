import Joi from 'joi'
import Boom from '@hapi/boom'
import { kebabCase, upperFirst } from 'lodash'

import { scopes } from '~/src/server/common/constants/scopes'
import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { buildRunningServicesRowHeadings } from '~/src/server/common/helpers/build-running-services-row-headings'
import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope'

const serviceEnvironmentSecretsController = {
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
    const environments = getEnvironmentsByTeam(service.teams)
    const formattedEnvironment = upperFirst(kebabCase(environment))

    return h.view('services/views/service-environment-secrets', {
      pageTitle: `${service.serviceName} - Secrets - ${formattedEnvironment}`,
      heading: service.serviceName,
      rowHeadings: buildRunningServicesRowHeadings(environments),
      service,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: service.serviceName,
          href: `/services/${service.serviceName}`
        },
        {
          text: 'Secrets',
          href: `/services/${service.serviceName}/secrets`
        },
        {
          text: formattedEnvironment
        }
      ]
    })
  }
}

export { serviceEnvironmentSecretsController }
