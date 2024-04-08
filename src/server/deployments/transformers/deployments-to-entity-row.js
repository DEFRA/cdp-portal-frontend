import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'
import { sanitizeUser } from '~/src/server/common/helpers/sanitize-user'
import { augmentStatus } from '~/src/server/deployments/helpers/augment-status'

function deploymentsToEntityRow(deployedService) {
  const status = augmentStatus(deployedService)

  return [
    {
      kind: 'link',
      value: deployedService.service,
      url: `/deployments/${deployedService.environment.toLowerCase()}/${
        deployedService.cdpDeploymentId
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
      value: status,
      classes: provideDeploymentStatusClassname(status)
    },
    {
      kind: 'text',
      value: sanitizeUser(deployedService.user?.displayName)
    },
    {
      kind: 'date',
      value: deployedService.created,
      withSeconds: true
    }
  ]
}

export { deploymentsToEntityRow }
