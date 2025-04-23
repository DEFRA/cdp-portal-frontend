import { creationStatuses } from '~/src/server/common/constants/creation-statuses.js'

function statusTagClassMap(status) {
  switch (true) {
    case [
      creationStatuses.raised,
      creationStatuses.prOpen,
      creationStatuses.merged
    ].includes(status):
      return 'govuk-tag--purple'

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
      creationStatuses.success,
      creationStatuses.workflowCompleted
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
      return 'govuk-tag--yellow'

    default:
      return 'govuk-tag--grey'
  }
}

export { statusTagClassMap }
