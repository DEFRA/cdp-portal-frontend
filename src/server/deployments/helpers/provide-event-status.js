import { deploymentStatus } from '~/src/server/deployments/constants/deployment-status'
import { provideDeploymentStatusText } from '~/src/server/deployments/helpers/provide-deployment-status-text'
import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'

function provideEventStatus(deployment) {
  const statusText = provideDeploymentStatusText(deployment)

  return {
    text: statusText,
    classes: provideDeploymentStatusClassname(statusText),
    hasFinished: statusText === deploymentStatus.deployed
  }
}

export { provideEventStatus }
