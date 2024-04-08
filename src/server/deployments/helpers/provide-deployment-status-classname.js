import { deploymentStatus } from '~/src/server/deployments/constants/status'

function provideDeploymentStatusClassname(status) {
  switch (status) {
    case deploymentStatus.running:
      return 'govuk-tag--green'
    case deploymentStatus.stopping:
    case deploymentStatus.pending:
      return 'govuk-tag--blue'
    case deploymentStatus.requested:
      return 'govuk-tag--purple'
    case deploymentStatus.stopped:
      return 'govuk-tag--light-blue'
    case deploymentStatus.failed:
      return 'govuk-tag--red'
    default:
      return 'govuk-tag--grey'
  }
}

export { provideDeploymentStatusClassname }
