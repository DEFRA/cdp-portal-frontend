import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'

function entityToSummary(entity, environment, authedUser) {
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
