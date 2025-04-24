import { databaseDeploymentStatus } from '~/src/server/database-deployments/constants/status.js'

function provideStatusClassname(status) {
  switch (status) {
    case databaseDeploymentStatus.succeeded:
      return 'govuk-tag--green'
    case databaseDeploymentStatus.inProgress:
    case databaseDeploymentStatus.requested:
      return 'govuk-tag--purple'
    case databaseDeploymentStatus.stopped:
    case databaseDeploymentStatus.timedOut:
      return 'govuk-tag--light-blue'
    case databaseDeploymentStatus.failed:
    case databaseDeploymentStatus.fault:
      return 'govuk-tag--red'
    default:
      return 'govuk-tag--grey'
  }
}

export { provideStatusClassname }
