import { renderIcon } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { buildLink } from '~/src/server/common/helpers/view/build-link.js'

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
        value: { text: vanityUrl.environment }
      },
      {
        key: {
          html: `<div class="app-!-layout-flex-start">${renderIcon('warning-icon', { classes: 'app-icon--tiny govuk-!-margin-right-1' })} Shuttered</div>`
        },
        value: { text: vanityUrl.shuttered ? 'Yes' : 'No' }
      },
      {
        key: {
          html: `<div class="app-!-layout-flex-start">${renderIcon('internal-icon', { classes: 'app-icon--tiny govuk-!-margin-right-1' })} Internal</div>`
        },
        value: { text: vanityUrl.enabled ? 'Yes' : 'No' }
      }
    ]
  }
}

export { vanityUrlToSummary }
