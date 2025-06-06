import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'
import { shutteringStatus } from '~/src/server/common/constants/shuttering.js'

function shutteringDetailToSummary(detail, entity, authedUser) {
  return {
    classes: 'app-summary-list',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: 'Url' },
        value: { html: buildLink({ href: `https://${detail.url}` }) }
      },
      {
        key: { text: 'Environment' },
        value: { text: formatText(detail.environment) }
      },
      {
        key: {
          text: 'Status'
        },
        value: {
          html: renderTag(detail.status, [
            detail.status === shutteringStatus.shuttered
              ? 'govuk-tag--red'
              : 'govuk-tag--green'
          ])
        }
      },
      {
        key: {
          text: 'Internal'
        },
        value: { text: detail.internal ? 'No' : 'Yes' }
      },
      {
        key: { text: 'Requested By' },
        value: { text: authedUser.displayName }
      }
    ]
  }
}

export { shutteringDetailToSummary }
