import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { fetchAllSecrets } from '~/src/server/services/helpers/fetch/fetch-all-secrets'
import { adminOwnedService } from '~/src/server/common/helpers/user/admin-owned-service'
import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team'
import { allEnvironmentSecrets } from '~/src/server/services/transformers/secrets/all-environment-secrets'

const allSecretsController = {
  options: {
    id: 'services/{serviceId}/secrets',
    pre: [provideService],
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
    const environments = getEnvironmentsByTeam(service.teams)
    const allSecrets = await fetchAllSecrets(serviceName)
    const secretsByEnvironment = allEnvironmentSecrets(environments, allSecrets)

    const serviceTeamIds = service.teams?.map((team) => team.teamId)
    const isAdminOwnedService = adminOwnedService(serviceTeamIds)

    return h.view('services/views/secrets/all', {
      pageTitle: `${serviceName} - Secrets`,
      heading: serviceName,
      service,
      secretsByEnvironment,
      isAdminOwnedService,
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
