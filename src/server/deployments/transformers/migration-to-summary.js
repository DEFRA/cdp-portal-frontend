import { buildLink } from '../../common/helpers/view/build-link.js'
import { noValue } from '../../common/constants/no-value.js'
import { provideStatusClassname } from '../helpers/provide-status-classname.js'
import { buildDatabaseLogsLink } from '../helpers/build-database-logs-link.js'
import {
  formatText,
  sanitiseUser
} from '../../../config/nunjucks/filters/filters.js'
import {
  renderComponent,
  renderIcon
} from '../../common/helpers/nunjucks/render-component.js'
import { databaseStatus } from '../constants/database-status.js'
import { renderTag } from '../../common/helpers/view/render-tag.js'

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
        key: { text: 'Microservice name' },
        value: {
          html: buildLink({
            href: `/services/${migration.service}`,
            text: migration.service,
            newTab: false
          })
        }
      },
      {
        key: { text: 'Environment' },
        value: { text: migration.environment ?? noValue }
      },
      {
        key: { text: 'Changelog version' },
        value: {
          html: migration.version
            ? buildLink({
                href: `https://github.com/DEFRA/${migration.service}/releases/tag/${migration.version}`,
                text: migration.version
              })
            : noValue
        }
      },
      {
        key: {
          text: 'Status'
        },
        value: {
          html: renderTag({
            text: formatText(migration.status),
            classes: provideStatusClassname(migration.status)
          })
        }
      },
      {
        key: { text: 'Kind' },
        value: {
          html: `<div class="app-!-layout-centered">
                  ${renderIcon('database-icon', { classes: 'app-icon--small govuk-!-margin-right-1' })}
                  ${renderTag({ text: 'Update' })}
                </div>`
        }
      },
      {
        key: { text: 'Deployed by' },
        value: {
          text: sanitiseUser(migration.user?.displayName)
        }
      },
      {
        key: { text: 'Logs' },
        value: {
          html: logsLinkDataAvailable
            ? buildLink({
                href: buildDatabaseLogsLink(migration, hasResult),
                text: `https://logs.${migration.environment}.cdp-int.defra.cloud`
              })
            : noValue
        }
      },
      {
        key: { text: 'Metrics' },
        value: {
          html: buildLink({
            href: `https://metrics.${migration.environment}.cdp-int.defra.cloud/dashboards/f/${migration.service}`,
            text: `https://metrics.${migration.environment}.cdp-int.defra.cloud`
          })
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
