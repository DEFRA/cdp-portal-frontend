import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { provideStatusClassname } from '~/src/server/database-deployments/helpers/provide-status-classname.js'
import {
  formatText,
  sanitiseUser
} from '~/src/config/nunjucks/filters/filters.js'

function transformMigrationToSummary(migration) {
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
          html: renderComponent('tag', {
            text: formatText(migration.kind),
            classes: 'govuk-tag--purple'
          })
        }
      },
      {
        key: { text: 'Deployed By' },
        value: {
          text: sanitiseUser(migration.user?.displayName)
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
