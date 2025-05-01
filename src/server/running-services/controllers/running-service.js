import Joi from 'joi'
import Boom from '@hapi/boom'

import { transformRunningService } from '~/src/server/running-services/helpers/transformers/running-service.js'
import { transformRunningServiceToSummary } from '~/src/server/running-services/helpers/transformers/running-service-to-summary.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { fetchLatestMigrations } from '~/src/server/common/helpers/fetch/fetch-latest-migrations.js'
import { provideDatabaseStatusClassname } from '~/src/server/common/components/database-detail/provide-database-status-classname.js'

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
    const authedUser = await request.getUserSession()
    const environments = getEnvironments(authedUser?.scope)
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
