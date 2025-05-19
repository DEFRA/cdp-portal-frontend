import { databaseStatus } from '~/src/server/deployments/constants/database-status.js'

function provideStatusClassname(status) {
  switch (status) {
    case databaseStatus.succeeded:
      return 'govuk-tag--green'
    case databaseStatus.inProgress:
    case databaseStatus.requested:
      return 'app-tag--purple'
    case databaseStatus.stopped:
    case databaseStatus.timedOut:
      return 'govuk-tag--light-blue'
    case databaseStatus.failed:
    case databaseStatus.fault:
      return 'govuk-tag--red'
    default:
      return 'govuk-tag--grey'
  }
}

export { provideStatusClassname }
