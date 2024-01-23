import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'
import { sanitizeUser } from '~/src/server/common/helpers/sanitize-user'
import { provideDeploymentStatusText } from '~/src/server/deployments/helpers/provide-deployment-status-text'

function transformDeploymentsToEntityRow(deployedService) {
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
      kind: 'text',
      value: deployedService.version
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
      formatString: 'k:mm:ss EE do MMM yyyy'
    }
  ]
}

export { transformDeploymentsToEntityRow }
