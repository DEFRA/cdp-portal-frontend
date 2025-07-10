import { noValue } from '~/src/server/common/constants/no-value.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { statusTagClassMap } from '~/src/server/common/helpers/status-tag-class-map.js'

function transformDecommissionToRow(entity) {
  const status = entity.status

  const decommissionedStatus =
    status === 'Decommissioned'
      ? {
          headers: 'status',
          entity: {
            kind: 'date',
            value: entity.decommissioned?.decommissionedAt
          }
        }
      : {
          headers: 'status',
          entity: {
            kind: 'tag',
            value: formatText(status),
            classes: statusTagClassMap(status)
          }
        }

  return {
    cells: [
      {
        headers: 'entity',
        entity: {
          kind: 'link',
          url: `/admin/decommissions/${entity.name}`,
          value: entity.name
        }
      },
      {
        headers: 'by',
        entity: {
          kind: 'text',
          value: entity.decommissioned?.decommissionedBy?.displayName ?? noValue
        }
      },
      {
        headers: 'on',
        entity: {
          kind: 'date',
          value: entity.decommissioned?.decommissionedAt
        }
      },
      decommissionedStatus
    ]
  }
}

export { transformDecommissionToRow }
