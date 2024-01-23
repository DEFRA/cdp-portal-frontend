import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'
import { sanitizeUser } from '~/src/server/common/helpers/sanitize-user'
import { provideStatusText } from '~/src/server/deployments/helpers/provide-status-text'

function transformDeploymentsToEntityRow(deployedService) {
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
      value: provideStatusText(deployedService.status),
      classes: provideDeploymentStatusClassname(deployedService.status)
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
