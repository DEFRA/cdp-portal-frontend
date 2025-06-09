import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'
import { noValue } from '~/src/server/common/constants/no-value.js'

function entityToSummary(entity, deployment, environment, authedUser) {
  return {
    classes: 'app-summary-list',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: 'Service name' },
        value: {
          html: buildLink({
            href: `/services/${entity.name}`,
            text: entity.name,
            newTab: false
          })
        }
      },
      {
        key: { text: 'Version' },
        value: {
          html: deployment.version
            ? buildLink({
                href: `https://github.com/DEFRA/${deployment.service}/releases/tag/${deployment.version}`,
                text: deployment.version
              })
            : noValue
        }
      },
      {
        key: { text: 'Status' },
        value: {
          html: renderTag(formatText(deployment.status), [
            deployment.statusClassname
          ])
        }
      },
      {
        key: { text: 'Environment' },
        value: { text: formatText(environment) }
      },
      {
        key: { text: 'Requested By' },
        value: { text: authedUser.displayName }
      }
    ]
  }
}

export { entityToSummary }
