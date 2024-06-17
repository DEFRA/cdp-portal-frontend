import { creationStatuses } from '~/src/server/common/constants/creation-statuses'

function statusTagClassMap(status) {
  switch (true) {
    case status === creationStatuses.raised:
    case status === creationStatuses.prOpen:
    case status === creationStatuses.merged:
      return 'govuk-tag--purple'

    case status === creationStatuses.requested:
    case status === creationStatuses.inProgress:
      return 'govuk-tag--blue'

    case status === creationStatuses.notRequested:
      return 'govuk-tag--grey'

    case status === creationStatuses.created:
    case status === creationStatuses.success:
    case status === creationStatuses.workflowCompleted:
      return 'govuk-tag--green'

    case status === creationStatuses.unknown:
    case status === creationStatuses.failure:
    case status === creationStatuses.prClosed:
      return 'govuk-tag--red'

    default:
      return 'govuk-tag--grey'
  }
}

export { statusTagClassMap }
