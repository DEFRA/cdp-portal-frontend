import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { provideMigration } from '~/src/server/deployments/helpers/pre/provide-migration.js'
import { getAllEnvironmentKebabNames } from '~/src/server/common/helpers/environments/get-environments.js'
import { transformMigrationToSummary } from '~/src/server/deployments/transformers/migration-to-summary.js'
import { databaseStatus } from '~/src/server/deployments/constants/database-status.js'
import { pagination } from '~/src/server/common/constants/pagination.js'

const databaseUpdateController = {
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

    return h.view('deployments/views/database-update', {
      pageTitle: `${migration.service} ${migration.version} migration - ${formattedEnvironment}`,
      heading: `${formattedEnvironment} database update`,
      caption: `Database update for <strong>${migration.service}</strong>, version <strong>${migration.version}</strong>`,
      migration,
      shouldPoll: migration.status !== databaseStatus.succeeded,
      summaryList: transformMigrationToSummary(migration),
      breadcrumbs: [
        {
          text: 'Deployments',
          href: `/deployments?page=${pagination.page}&size=${pagination.size}`
        },
        {
          text: formattedEnvironment,
          href: `/deployments/${environment}?page=${pagination.page}&size=${pagination.size}`
        },
        {
          text: `${migration.service} - ${migration.version}`
        }
      ]
    })
  }
}

export { databaseUpdateController }
