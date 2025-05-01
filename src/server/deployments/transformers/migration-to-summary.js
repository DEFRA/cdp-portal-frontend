import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { provideStatusClassname } from '~/src/server/deployments/helpers/provide-status-classname.js'
import { buildDatabaseLogsLink } from '~/src/server/deployments/helpers/build-database-logs-link.js'
import {
  formatText,
  sanitiseUser
} from '~/src/config/nunjucks/filters/filters.js'
import {
  renderComponent,
  renderIcon
} from '~/src/server/common/helpers/nunjucks/render-component.js'
import { databaseStatus } from '~/src/server/deployments/constants/database-status.js'

function transformMigrationToSummary(migration) {
  const logsLinkDataAvailable = [
    migration.environment,
    migration.buildId,
    migration.created,
    migration.updated
  ].every(Boolean)

  const hasResult =
    migration.status === databaseStatus.succeeded ||
    migration.status === databaseStatus.failed

  return {
    classes: 'app-summary-list govuk-!-margin-bottom-0',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: 'Service Name' },
        value: {
          html: buildLink(
            `/services/${migration.service}`,
            migration.service,
            false
          )
        }
      },
      {
        key: { text: 'Environment' },
        value: { text: migration.environment ?? noValue }
      },
      {
        key: { text: 'Version' },
        value: { text: migration.version ?? noValue }
      },
      {
        key: {
          text: 'Status'
        },
        value: {
          html: renderComponent('tag', {
            text: formatText(migration.status),
            classes: provideStatusClassname(migration.status)
          })
        }
      },
      {
        key: { text: 'Kind' },
        value: {
          html:
            '<div class="app-!-layout-centered">' +
            renderIcon('database-icon', {
              classes: 'app-icon--small govuk-!-margin-right-1'
            }) +
            renderComponent('tag', {
              text: formatText(migration.kind)
            }) +
            '</div>'
        }
      },
      {
        key: { text: 'Deployed By' },
        value: {
          text: sanitiseUser(migration.user?.displayName)
        }
      },
      {
        key: { text: 'Logs' },
        value: {
          html: logsLinkDataAvailable
            ? buildLink(
                buildDatabaseLogsLink(migration, hasResult),
                `https://logs.${migration.environment}.cdp-int.defra.cloud`
              )
            : noValue
        }
      },
      {
        key: { text: 'Updated' },
        value: {
          html: renderComponent('time', { datetime: migration.updated })
        }
      },
      {
        key: { text: 'Created' },
        value: {
          html: renderComponent('time', { datetime: migration.created })
        }
      }
    ]
  }
}

export { transformMigrationToSummary }
