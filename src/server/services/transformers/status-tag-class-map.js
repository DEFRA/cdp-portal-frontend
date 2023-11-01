import { serviceCreationStatuses } from '~/src/server/common/constants/service-creation-statuses'

function statusTagClassMap(status) {
  switch (true) {
    case status === serviceCreationStatuses.raised:
    case status === serviceCreationStatuses.prOpen:
      return 'govuk-tag--purple'

    case status === serviceCreationStatuses.inProgress:
      return 'govuk-tag--blue'

    case status === serviceCreationStatuses.notRequested:
      return 'govuk-tag--grey'

    case status === serviceCreationStatuses.success:
    case status === serviceCreationStatuses.workflowCompleted:
      return 'govuk-tag--green'

    case status === serviceCreationStatuses.failed: // TODO remove once API results have settled
    case status === serviceCreationStatuses.failure:
      return 'govuk-tag--red'

    default:
      return 'govuk-tag--grey'
  }
}

export { statusTagClassMap }
