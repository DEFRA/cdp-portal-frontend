import Joi from 'joi'
import Boom from '@hapi/boom'

import { transformRunningService } from '../helpers/transformers/running-service.js'
import { transformRunningServiceToSummary } from '../helpers/transformers/running-service-to-summary.js'
import { getEnvironments } from '../../common/helpers/environments/get-environments.js'
import { fetchLatestMigrations } from '../../common/helpers/fetch/fetch-latest-migrations.js'
import { provideDatabaseStatusClassname } from '../../common/components/database-detail/provide-database-status-classname.js'

const runningServiceController = {
  options: {
    validate: {
      params: Joi.object({
        serviceName: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceName = request.params.serviceName

    const latestMigrations = await fetchLatestMigrations(serviceName)
    const userSession = await request.getUserSession()
    const environments = getEnvironments(userSession?.scope)
    const { runningServices, teams } =
      await transformRunningService(serviceName)

    return h.view('running-services/views/running-service', {
      pageTitle: `${serviceName} - Running service`,
      summaryList: transformRunningServiceToSummary(serviceName, teams),
      runningServiceName: serviceName,
      runningServices,
      latestMigrations: latestMigrations.map((migration) => ({
        ...migration,
        statusClassname: provideDatabaseStatusClassname(migration.status)
      })),
      environments,
      breadcrumbs: [
        {
          text: 'Running Services',
          href: '/running-services'
        },
        {
          text: serviceName
        }
      ]
    })
  }
}

export { runningServiceController }
