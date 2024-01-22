import { deploymentStatus } from '~/src/server/deployments/constants/deployment-status'

function provideStatusText(status) {
  switch (status.toLowerCase()) {
    case deploymentStatus.running:
      return deploymentStatus.deployed
    case deploymentStatus.failed:
      return deploymentStatus.failed
    case deploymentStatus.stopped:
      return deploymentStatus.stopped
    case deploymentStatus.requested:
      return deploymentStatus.requested
    default:
      return deploymentStatus.pending
  }
}

export { provideStatusText }
