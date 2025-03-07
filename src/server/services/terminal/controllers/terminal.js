import Joi from 'joi'
import Boom from '@hapi/boom'

import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { terminalEnvironments } from '~/src/server/services/terminal/helpers/can-launch-terminal.js'
import { fetchTenantService } from '~/src/server/common/helpers/fetch/fetch-tenant-service.js'

export async function getTerminalEnvs(service, userScopes) {
  const serviceName = service?.serviceName

  if (!serviceName) {
    return []
  }

  const environments = terminalEnvironments(userScopes)
  const tenantService = (await fetchTenantService(serviceName)) ?? {}

  return Object.keys(tenantService)
    .filter((env) => environments.includes(env))
    .sort(sortByEnv)
}

const terminalController = {
  options: {
    id: 'services/{serviceId}/terminal',
    pre: [provideService],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const service = request.pre.service
    const terminalEnvs = await getTerminalEnvs(
      service,
      request.auth.credentials?.scope
    )
    const canLaunchTerminal = terminalEnvs.length > 0

    return h.view('services/terminal/views/terminal', {
      pageTitle: `${serviceId} - Terminal`,
      service,
      canLaunchTerminal,
      terminalEnvs,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: serviceId,
          href: `/services/${serviceId}`
        },
        {
          text: 'Terminal'
        }
      ]
    })
  }
}

export { terminalController }
