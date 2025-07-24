import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '../../../config/nunjucks/filters/filters.js'
import { pagination } from '../../common/constants/pagination.js'
import { databaseStatus } from '../constants/database-status.js'
import { provideMigration } from '../helpers/pre/provide-migration.js'
import { getAllEnvironmentKebabNames } from '../../common/helpers/environments/get-environments.js'
import { transformMigrationToSummary } from '../transformers/migration-to-summary.js'
import { databaseUpdateFaviconState } from '../helpers/database-update-favicon-state.js'

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
