import { deploymentStatus } from '~/src/server/deployments/constants/deployment-status'
import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'

function getDeploymentStatusText(tasks) {
  if (tasks.length) {
    const allRunning = tasks.every(
      (task) => task.status.text === deploymentStatus.deployed
    )
    const anyFailed = tasks.some(
      (task) => task.status.text === deploymentStatus.failed
    )
    const anyRequested = tasks.some(
      (task) => task.status.text === deploymentStatus.requested
    )
    const anyPending = tasks.some(
      (task) => task.status.text === deploymentStatus.pending
    )
    const anyDeploying = tasks.some(
      (task) => task.status.text === deploymentStatus.deploying
    )
    const anyStopping = tasks.some(
      (task) => task.status.text === deploymentStatus.stopping
    )
    const allStopped = tasks.every(
      (task) => task.status.text === deploymentStatus.stopped
    )

    switch (true) {
      case allRunning:
        return deploymentStatus.deployed
      case allStopped:
        return deploymentStatus.stopped
      case anyFailed:
        return deploymentStatus.failed
      case anyPending:
        return deploymentStatus.pending
      case anyRequested:
      case anyDeploying:
        return deploymentStatus.deploying
      case anyStopping:
        return deploymentStatus.stopping

      default:
        return deploymentStatus.pending
    }
  }

  return deploymentStatus.pending
}

function calculateDeploymentStatus(tasks) {
  const deploymentStatusText = getDeploymentStatusText(tasks)

  return {
    text: deploymentStatusText,
    classes: provideDeploymentStatusClassname(deploymentStatusText),
    hasFinished: deploymentStatusText === deploymentStatus.deployed
  }
}

export { calculateDeploymentStatus }
