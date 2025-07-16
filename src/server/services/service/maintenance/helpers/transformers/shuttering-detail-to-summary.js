import { noValue } from '~/src/server/common/constants/no-value.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { shutteringStatus } from '~/src/server/common/constants/shuttering.js'
import { renderTag } from '~/src/server/common/helpers/view/render-tag.js'

function shutteringDetailToSummary({
  isFrontend,
  shutteringDetail,
  authedUser
}) {
  return {
    classes: 'app-summary-list',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: isFrontend ? 'Service URL' : 'API Gateway URL' },
        value: { html: buildLink({ href: `https://${shutteringDetail.url}` }) }
      },
      {
        key: { text: 'Environment' },
        value: { text: formatText(shutteringDetail.environment) }
      },
      {
        key: {
          text: 'Status'
        },
        value: {
          html: renderTag({
            text: shutteringDetail.status,
            classes: [
              shutteringDetail.status === shutteringStatus.shuttered
                ? 'govuk-tag--red'
                : 'govuk-tag--green'
            ]
          })
        }
      },
      {
        key: { text: 'Requested By' },
        value: { text: authedUser?.displayName ?? noValue }
      }
    ]
  }
}

export { shutteringDetailToSummary }
