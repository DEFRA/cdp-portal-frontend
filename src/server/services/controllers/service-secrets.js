import Joi from 'joi'
import Boom from '@hapi/boom'

import { scopes } from '~/src/server/common/constants/scopes'
import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { provideCanDeploy } from '~/src/server/services/helpers/pre/provide-can-deploy'
import { buildRunningServicesRowHeadings } from '~/src/server/common/helpers/build-running-services-row-headings'
import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope'

const serviceSecretsController = {
  options: {
    id: 'services/{serviceId}/secrets',
    ext: {
      onCredentials: addServiceOwnerScope()
    },
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.serviceOwner]
      }
    },
    pre: [[provideService], provideCanDeploy],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const service = request.pre.service
    const environments = getEnvironmentsByTeam(service.teams)

    return h.view('services/views/service-secrets', {
      pageTitle: `${service.serviceName} microservice`,
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
          text: 'Secrets'
        }
      ]
    })
  }
}

export { serviceSecretsController }
