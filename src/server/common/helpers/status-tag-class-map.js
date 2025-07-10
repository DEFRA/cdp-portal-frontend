import { creationStatuses } from '~/src/server/common/constants/creation-statuses.js'

function statusTagClassMap(status) {
  switch (true) {
    case [
      creationStatuses.raised,
      creationStatuses.prOpen,
      creationStatuses.merged
    ].includes(status):
      return 'app-tag--purple'

    case [
      creationStatuses.requested,
      creationStatuses.inProgress,
      creationStatuses.InProgress
    ].includes(status):
      return 'govuk-tag--blue'

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
