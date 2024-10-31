/**
 * Returns a user-friendly version of the last deployment message.
 * We infer from the task status vs deployment status what in-progress actually means.
 * @param {{status: string, lastDeploymentStatus: string, lastDeploymentMessage:string}} deployment
 * @returns {string} message
 */
import { deploymentStatus } from '~/src/server/deployments/constants/status.js'

function provideEcsDeploymentStatus(deployment) {
  switch (deployment.lastDeploymentStatus) {
    case 'SERVICE_DEPLOYMENT_IN_PROGRESS':
      return {
        message: generateInProgressMessage(
          deployment.status,
          deployment.lastDeploymentMessage
        )
      }
    case 'SERVICE_DEPLOYMENT_COMPLETED':
      return {
        message: 'Complete'
      }
    case 'SERVICE_DEPLOYMENT_FAILED':
      return {
        message: deployment.lastDeploymentMessage
      }
    default:
      return { message: '' }
  }
}

/**
 *
 * @param {string} taskStatus
 * @param {string }lastDeploymentMessage
 * @returns {string} message
 */
function generateInProgressMessage(taskStatus, lastDeploymentMessage) {
  if (lastDeploymentMessage?.endsWith('in progress.')) {
    if (taskStatus === deploymentStatus.running) {
      return 'Stopping previous deployment.'
    }
    return 'In progress'
  }
  return lastDeploymentMessage
}

export { provideEcsDeploymentStatus }
