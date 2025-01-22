import { deploymentStatus } from '~/src/server/deployments/constants/status.js'

const statusFilterOrder = [
  deploymentStatus.requested,
  deploymentStatus.running,
  deploymentStatus.pending,
  deploymentStatus.stopping,
  deploymentStatus.stopped,
  deploymentStatus.failed,
  deploymentStatus.undeployed
]

export { statusFilterOrder }
