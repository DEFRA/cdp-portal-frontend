import { deploymentStatus } from '../../common/constants/deployment.js'

function provideDeploymentStatusClassname(status) {
  switch (status) {
    case deploymentStatus.running:
      return 'govuk-tag--green'
    case deploymentStatus.stopping:
    case deploymentStatus.pending:
    case deploymentStatus.requested:
      return 'app-tag--purple'
    case deploymentStatus.stopped:
      return 'govuk-tag--light-blue'
    case deploymentStatus.failed:
      return 'govuk-tag--red'
    default:
      return 'govuk-tag--grey'
  }
}

export { provideDeploymentStatusClassname }
