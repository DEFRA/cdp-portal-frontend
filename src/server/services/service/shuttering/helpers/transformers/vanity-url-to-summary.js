import { renderIcon } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'

function vanityUrlToSummary(vanityUrl, entity) {
  return {
    classes: 'app-summary-list',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: 'Url' },
        value: { html: buildLink({ href: `https://${vanityUrl.url}` }) }
      },
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
        value: { text: formatText(vanityUrl.environment) }
      },
      {
        key: {
          text: 'Shuttered'
        },
        value: { text: vanityUrl.shuttered ? 'Yes' : 'No' }
      },
      {
        key: {
          text: 'Internal'
        },
        value: { text: vanityUrl.enabled ? 'No' : 'Yes' }
      }
    ]
  }
}

export { vanityUrlToSummary }
