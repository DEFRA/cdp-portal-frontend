import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { provideMigration } from '~/src/server/database-deployments/helpers/pre/provide-migration.js'
import { getAllEnvironmentKebabNames } from '~/src/server/common/helpers/environments/get-environments.js'
import { transformMigrationToSummary } from '~/src/server/database-deployments/transformers/migration-to-summary.js'
import { databaseDeploymentStatus } from '~/src/server/database-deployments/constants/status.js'

const databaseDeploymentController = {
  options: {
    pre: [provideMigration],
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...getAllEnvironmentKebabNames()),
        migrationId: Joi.string()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const migration = request.pre.migration
    const environment = migration.environment
    const formattedEnvironment = formatText(environment)

    return h.view('database-deployments/views/deployment', {
      pageTitle: `${migration.service} ${migration.version} migration - ${formattedEnvironment}`,
      heading: `${formattedEnvironment} database deployment`,
      caption: `Database deployment for <strong>${migration.service}</strong>, version <strong>${migration.version}</strong>`,
      migration,
      shouldPoll: migration.status !== databaseDeploymentStatus.succeeded,
      summaryList: transformMigrationToSummary(migration)
    })
  }
}

export { databaseDeploymentController }
