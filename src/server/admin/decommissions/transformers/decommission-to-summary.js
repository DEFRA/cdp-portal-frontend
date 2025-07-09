import { noValue } from '~/src/server/common/constants/no-value.js'
import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'

function transformDecommissionToSummary(decommission) {
  return {
    classes: 'app-summary-list',
    rows: [
      {
        key: { text: 'Value' },
        value: { text: decommission.value }
      },
      {
        key: { text: 'Description' },
        value: { text: decommission.description ?? noValue }
      },
      {
        key: { text: 'Last Updated' },
        value: {
          html: renderComponent('time', { datetime: decommission.updatedAt })
        }
      },
      {
        key: { text: 'Created By' },
        value: { text: decommission.createdBy.name }
      },
      {
        key: { text: 'Created' },
        value: {
          html: renderComponent('time', { datetime: decommission.createdAt })
        }
      }
    ]
  }
}

export { transformDecommissionToSummary }
