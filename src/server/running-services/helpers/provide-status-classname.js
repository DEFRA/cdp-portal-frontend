import { deploymentStatus } from '~/src/server/deployments/constants/status.js'

function provideStatusClassname(status) {
  switch (status) {
    case deploymentStatus.running:
      return 'item-detail--green'
    case deploymentStatus.stopping:
    case deploymentStatus.pending:
    case deploymentStatus.requested:
      return 'item-detail--purple'
    case deploymentStatus.stopped:
      return 'item-detail--light-blue'
    case deploymentStatus.failed:
      return 'item-detail--red'
    case deploymentStatus.undeployed:
      return 'item-detail--grey'
    default:
      return 'item-detail--grey'
  }
}

export { provideStatusClassname }
