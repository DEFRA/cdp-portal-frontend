import { deploymentStatus } from '~/src/server/deployments/constants/deployment-status'

function provideDeploymentStatusClassname(status) {
  const statusToLowerCase = status?.toLowerCase()

  switch (true) {
    case statusToLowerCase === deploymentStatus.running:
    case statusToLowerCase === deploymentStatus.deployed:
      return 'govuk-tag--green'
    case statusToLowerCase === deploymentStatus.failed:
      return 'govuk-tag--red'
    case statusToLowerCase === deploymentStatus.deploying:
    case statusToLowerCase === deploymentStatus.stopping:
    case statusToLowerCase === deploymentStatus.pending:
      return 'govuk-tag--blue'
    case statusToLowerCase === deploymentStatus.requested:
      return 'govuk-tag--purple'
    case statusToLowerCase === deploymentStatus.stopped:
      return 'govuk-tag--grey'
    default:
      return 'govuk-tag--grey'
  }
}

export { provideDeploymentStatusClassname }
