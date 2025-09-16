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
      return 'govuk-tag--grey'
  }
}

export function transformAuditToRow(audit) {
  const { startDate, endDate } = audit.details
  const hasDuration = startDate && endDate

  return {
    cells: [
      {
        headers: 'performedBy',
        entity: {
          kind: 'text',
          value: audit.performedBy?.displayName
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
          value: audit.details?.user?.displayName
        }
      },
      {
        headers: 'team',
        entity: {
          kind: 'link',
          url: `/teams/${audit.details?.team?.name?.toLowerCase()}`,
          value: audit.details?.team?.name
        }
      },
      {
        headers: 'service',
        entity: {
          kind: 'link',
          url: `/services/${audit.details?.service?.toLowerCase()}`,
          value: audit.details?.service
        }
      },
      {
        headers: 'duration',
        entity: {
          kind: 'text',
          value: hasDuration
            ? formatDistanceStrict(startDate, endDate, { includeSeconds: true })
            : noValue
        }
      },
      {
        headers: 'reason',
        entity: {
          kind: 'text',
          value: audit.details?.reason
        }
      }
    ]
  }
}
