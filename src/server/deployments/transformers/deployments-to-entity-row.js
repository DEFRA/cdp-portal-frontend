import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'
import { sanitizeUser } from '~/src/server/common/helpers/sanitize-user'
import { provideDeploymentStatusText } from '~/src/server/deployments/helpers/provide-deployment-status-text'

function deploymentsToEntityRow(deployedService) {
  const statusText = provideDeploymentStatusText(deployedService)

  return [
    {
      kind: 'link',
      value: deployedService.service,
      url: `/deployments/${deployedService.environment.toLowerCase()}/${
        deployedService.deploymentId
      }`
    },
    {
      kind: 'link',
      value: deployedService.version,
      url: `https://github.com/DEFRA/${deployedService.service}/releases/tag/${deployedService.version}`,
      newWindow: true
    },
    {
      kind: 'tag',
      value: statusText,
      classes: provideDeploymentStatusClassname(statusText)
    },
    {
      kind: 'text',
      value: sanitizeUser(deployedService.user)
    },
    {
      kind: 'date',
      value: deployedService.createdAt,
      withSeconds: true
    }
  ]
}

export { deploymentsToEntityRow }
