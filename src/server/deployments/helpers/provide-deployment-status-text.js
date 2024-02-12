import { deploymentStatus } from '~/src/server/deployments/constants/deployment-status'

function provideDeploymentStatusText({
  status,
  desiredStatus,
  requestedCount
}) {
  const statusToLowerCase = status.toLowerCase()
  const desiredStatusToLowerCase = desiredStatus?.toLowerCase()

  switch (true) {
    case statusToLowerCase === deploymentStatus.running &&
      desiredStatusToLowerCase === deploymentStatus.stopped:
      return deploymentStatus.stopping

    case statusToLowerCase === deploymentStatus.requested &&
      requestedCount === 0:
      return deploymentStatus.stopped

    case statusToLowerCase === deploymentStatus.requested &&
      desiredStatusToLowerCase === deploymentStatus.running:
    case statusToLowerCase === deploymentStatus.pending &&
      desiredStatusToLowerCase === deploymentStatus.running:
      return deploymentStatus.deploying

    case statusToLowerCase === deploymentStatus.running:
      return deploymentStatus.deployed

    case statusToLowerCase === deploymentStatus.failed:
      return deploymentStatus.failed

    case statusToLowerCase === deploymentStatus.stopped:
      return deploymentStatus.stopped

    case statusToLowerCase === deploymentStatus.requested:
      return deploymentStatus.requested

    default:
      return deploymentStatus.pending
  }
}

export { provideDeploymentStatusText }
