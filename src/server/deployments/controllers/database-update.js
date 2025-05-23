import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { pagination } from '~/src/server/common/constants/pagination.js'
import { databaseStatus } from '~/src/server/deployments/constants/database-status.js'
import { provideMigration } from '~/src/server/deployments/helpers/pre/provide-migration.js'
import { getAllEnvironmentKebabNames } from '~/src/server/common/helpers/environments/get-environments.js'
import { transformMigrationToSummary } from '~/src/server/deployments/transformers/migration-to-summary.js'
import { databaseUpdateFaviconState } from '~/src/server/deployments/helpers/database-update-favicon-state.js'

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
      faviconState: databaseUpdateFaviconState(migration.status),
      pageTitle: `${migration.service} ${migration.version} database update - ${formattedEnvironment}`,
      pageHeading: {
        caption: 'Database update',
        text: migration.service,
        intro: `Database update for <strong>${migration.service}</strong>, changelog version <strong>${migration.version}</strong> in <strong>${migration.environment}</strong>`
      },
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
