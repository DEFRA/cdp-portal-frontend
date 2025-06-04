import Joi from 'joi'
import Boom from '@hapi/boom'
import { parseISO, subHours } from 'date-fns'

import { transformServiceToSummary } from '~/src/server/services/service/about/transformers/service-to-summary.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository.js'
import { nullify404 } from '~/src/server/common/helpers/nullify-404.js'
import { fetchEntityStatus } from '~/src/server/common/helpers/fetch/fetch-entities.js'

const serviceStatusController = {
  options: {
    id: 'services/{serviceId}/status',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const entity = request.app.entity

    if (entity === null) {
      return Boom.notFound()
    }

    const entityStatus = await fetchEntityStatus(request.params.serviceId)

    const serviceName = entityStatus.entity.name
    const userScopes = request.auth?.credentials?.scope
    const isServiceOwner = userScopes?.includes(scopes.serviceOwner)

    const repository = await fetchRepository(serviceName).catch(nullify404)

    const isFrontend = entity.subType === 'Frontend'
    const isBackend = entity.subType === 'Backend'
    const description = repository?.description

    const resources = Object.entries(entityStatus.resources).map(
      ([name, isReady]) => ({ name, isReady })
    )

    const service = {
      serviceName,
      isBackend,
      isFrontend,
      description,
      status: entity.status
    }

    const resourceDescriptions = {
      Repository:
        'Your services GitHub repository based on the template you chose',
      TenantServices: 'Supporting infrastructure for your service',
      SquidProxy: 'Proxy access set up for your service',
      NginxUpstreams:
        'Enable your service to be accessible to other services/public on the Core Delivery Platform environments',
      AppConfig: 'Application config creation',
      GrafanaDashboard: 'Grafana dashboards for your service'
    }

    const isTwoHoursOld = parseISO(entity.created) < subHours(Date.now(), 2)
    const takingTooLong = isTwoHoursOld && entity.status !== 'Created'

    const poll = { count: 0 }
    const shouldPoll = entity.status !== 'Created' && poll.count === 0

    // Provide a final xhr fetch after the entity status is 'Created'
    if (entity.status === 'Created') {
      poll.count += 1
    }

    const faviconState = entity.status !== 'Created' ? 'pending' : 'success'

    return h.view('services/service/creating/views/creating', {
      faviconState,
      pageTitle: `${entity.status} ${serviceName} microservice`,
      summaryList: transformServiceToSummary(repository, entity),
      service,
      isServiceOwner,
      resources,
      resourceDescriptions,
      takingTooLong,
      shouldPoll,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: serviceName
        }
      ]
    })
  }
}

export { serviceStatusController }
