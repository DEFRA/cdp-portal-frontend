import { formatDistanceStrict } from 'date-fns'

import { noValue } from '~/src/server/common/constants/no-value.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { renderTag } from '~/src/server/common/helpers/view/render-tag.js'
import { creationStatuses } from '~/src/server/common/constants/creation-statuses.js'

function transformDecommissionToRow(entity) {
  const statusTag = renderTag({
    text: formatText(entity.status),
    classes: [entity.statusClass],
    isLoading: entity.status !== creationStatuses.decommissioned
  })

  const durationEntity = entity.decommissioned?.finished
    ? {
        entity: {
          kind: 'text',
          value: formatDistanceStrict(
            entity.decommissioned.started,
            entity.decommissioned.finished,
            { includeSeconds: true }
          )
        }
      }
    : {
        entity: {
          kind: 'text',
          value: noValue
        }
      }

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
        html: `<strong>${entity.type}</strong> ${entity.subType}`
      },
      {
        headers: 'status',
        html: statusTag
      },
      {
        headers: 'started',
        entity: {
          kind: 'date',
          value: entity.decommissioned?.started
        }
      },
      {
        headers: 'duration',
        ...durationEntity
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
