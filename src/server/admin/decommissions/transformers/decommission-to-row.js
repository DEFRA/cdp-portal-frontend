import { noValue } from '~/src/server/common/constants/no-value.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'
import { creationStatuses } from '~/src/server/common/constants/creation-statuses.js'

function transformDecommissionToRow(entity) {
  const statusTag = renderTag(formatText(entity.status), [entity.statusClass])
  const statusHtml =
    entity.status !== creationStatuses.decommissioned
      ? `<div class="app-!-layout-centered">
              ${statusTag}
              ${renderComponent('loader', { classes: 'app-loader--is-loading app-loader--minimal app-loader--small' })}
            </div>`
      : statusTag

  return {
    cells: [
      {
        headers: 'name',
        entity: {
          kind: 'link',
          url: `/admin/decommissions/${entity.name}`,
          value: entity.name
        }
      },
      {
        headers: 'type',
        html: renderComponent('tag', {
          text: `${entity.type} - ${entity.subType}`,
          classes: 'govuk-tag--blue'
        })
      },
      {
        headers: 'status',
        html: statusHtml
      },
      {
        headers: 'started',
        entity: {
          kind: 'date',
          value: entity.decommissioned?.started
        }
      },
      {
        headers: 'by',
        entity: {
          kind: 'text',
          value: entity.decommissioned?.decommissionedBy?.displayName ?? noValue
        }
      }
    ]
  }
}

export { transformDecommissionToRow }
