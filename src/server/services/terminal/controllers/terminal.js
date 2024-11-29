import Joi from 'joi'
import Boom from '@hapi/boom'

import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { fetchRunningServicesById } from '~/src/server/common/helpers/fetch/fetch-running-services-by-id.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'

async function getTerminalEnvs(service, scopes) {
  const teams = service?.teams
  const serviceName = service?.serviceName

  if (!teams || !serviceName) {
    return []
  }

  const environments = getEnvironments(scopes)
  const runningServices = (await fetchRunningServicesById(serviceName)) ?? []
  const envsWithDeployment = [
    ...new Set(
      runningServices.map((runningService) => runningService.environment)
    )
  ]
    .filter((env) => environments.includes(env))
    .sort(sortByEnv)
  return envsWithDeployment.filter((env) => env !== 'prod')
}

const webShellController = {
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
      heading: serviceId,
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

export { webShellController }
