import { creationStatuses } from '../constants/creation-statuses.js'

function statusTagClassMap(status) {
  switch (true) {
    case [
      creationStatuses.raised,
      creationStatuses.prOpen,
      creationStatuses.merged,
      creationStatuses.requested,
      creationStatuses.inProgress,
      creationStatuses.InProgress,
      creationStatuses.decommissioning
    ].includes(status):
      return 'app-tag--purple'

    case status === creationStatuses.notRequested:
      return 'govuk-tag--grey'

    case [
      creationStatuses.created,
      creationStatuses.creating,
      creationStatuses.success,
      creationStatuses.workflowCompleted,
      creationStatuses.decommissioned
    ].includes(status):
      return 'govuk-tag--green'

    case [
      creationStatuses.unknown,
      creationStatuses.failure,
      creationStatuses.failed,
      creationStatuses.prClosed
    ].includes(status):
      return 'govuk-tag--red'

    case status === creationStatuses.queued:
      return 'app-tag--purple'

    default:
      return 'govuk-tag--grey'
  }
}

export { statusTagClassMap }
