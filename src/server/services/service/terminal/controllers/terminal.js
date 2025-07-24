import Joi from 'joi'
import Boom from '@hapi/boom'

import { sortByEnv } from '../../../../common/helpers/sort/sort-by-env.js'
import { terminalEnvironments } from '../helpers/can-launch-terminal.js'
import { fetchTenantService } from '../../../../common/helpers/fetch/fetch-tenant-service.js'

export async function getTerminalEnvs(serviceName, userScopes) {
  if (!serviceName) {
    return []
  }

  const environments = terminalEnvironments(userScopes)
  const tenantService = await fetchTenantService(serviceName)

  return Object.keys(tenantService)
    .filter((env) => environments.includes(env))
    .sort(sortByEnv)
}

const terminalController = {
  options: {
    id: 'services/{serviceId}/terminal',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceName = request.params.serviceId
    const terminalEnvs = await getTerminalEnvs(
      serviceName,
      request.auth.credentials?.scope
    )
    const canLaunchTerminal = terminalEnvs.length > 0

    return h.view('services/service/terminal/views/terminal', {
      pageTitle: `${serviceName} - Terminal`,
      serviceName,
      canLaunchTerminal,
      terminalEnvs,
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
          text: 'Terminal'
        }
      ]
    })
  }
}

export { terminalController }
