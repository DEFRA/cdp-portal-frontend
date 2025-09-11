import { formatDistanceStrict } from 'date-fns'

import { noValue } from '../../../common/constants/no-value.js'

function tagMap(action) {
  switch (action) {
    case 'Granted':
      return 'govuk-tag--green'
    case 'Removed':
      return 'govuk-tag--red'
    case 'TerminalAccess':
      return 'govuk-tag--blue'
    default:
      break
  }
}

export function transformAuditToRow(audit) {
  const durationEntity =
    audit.details?.startDate && audit.details?.endDate
      ? {
          entity: {
            kind: 'text',
            value: formatDistanceStrict(
              audit.details.startDate,
              audit.details.endDate,
              {
                includeSeconds: true
              }
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
        headers: 'performedBy',
        entity: {
          kind: 'text',
          value: audit.performedBy?.displayName ?? noValue
        }
      },
      {
        headers: 'action',
        entity: {
          kind: 'tag',
          value: audit.action,
          classes: tagMap(audit.action)
        }
      },
      {
        headers: 'started',
        entity: {
          kind: 'date',
          value: audit.performedAt
        }
      },
      {
        headers: 'user',
        entity: {
          kind: 'text',
          value: audit.details?.user?.displayName ?? noValue
        }
      },
      {
        headers: 'team',
        entity: {
          kind: 'text',
          value: audit.details?.team?.name ?? noValue
        }
      },
      {
        headers: 'duration',
        ...durationEntity
      },
      {
        headers: 'service',
        entity: {
          kind: 'text',
          value: audit.details?.service ?? noValue
        }
      },
      {
        headers: 'reason',
        entity: {
          kind: 'text',
          value: audit.details?.reason ?? noValue
        }
      }
    ]
  }
}
