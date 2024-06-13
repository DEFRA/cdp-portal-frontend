import { provideDeploymentStatusClassname } from '~/src/server/deployments/helpers/provide-deployment-status-classname'
import { sanitiseUser } from '~/src/server/common/helpers/sanitisation/sanitise-user'
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
      kind: 'text',
      value: deployedService.teams?.join(', ') ?? ''
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
      value: sanitiseUser(deployedService.user?.displayName)
    },
    {
      kind: 'date',
      value: deployedService.created,
      withSeconds: true
    }
  ]
}

export { deploymentsToEntityRow }
