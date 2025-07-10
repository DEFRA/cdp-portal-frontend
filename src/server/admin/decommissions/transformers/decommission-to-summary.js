import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { noValue } from '~/src/server/common/constants/no-value.js'

function transformDecommissionToSummary(entity) {
  return {
    classes: 'app-summary-list',
    rows: [
      {
        key: { text: 'Name' },
        value: { text: entity.name }
      },
      {
        key: { text: 'By' },
        value: { text: entity.decommissioned?.decommissionedBy ?? noValue }
      },
      {
        key: { text: 'On' },
        value: {
          html: entity.decommissioned?.decommissionedAt
            ? renderComponent('time', {
                datetime: entity.decommissioned?.decommissionedAt
              })
            : noValue
        }
      }
    ]
  }
}

export { transformDecommissionToSummary }
