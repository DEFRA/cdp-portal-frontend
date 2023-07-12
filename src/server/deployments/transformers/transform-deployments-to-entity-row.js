import { appConfig } from '~/src/config'
import { getDeploymentStatusClassname } from '~/src/server/deployments/helpers/get-deployment-status-classname'

function transformDeploymentsToEntityRow(deployedService) {
  return [
    {
      kind: 'link',
      value: deployedService.service,
      url: `${appConfig.get(
        'appPathPrefix'
      )}/deployments/${deployedService.environment.toLowerCase()}/${
        deployedService.deploymentId
      }`
    },
    {
      kind: 'text',
      value: deployedService.version
    },
    {
      kind: 'tag',
      value: deployedService.status,
      classes: getDeploymentStatusClassname(deployedService.status)
    },
    {
      kind: 'text',
      value: deployedService.user
    },
    {
      kind: 'date',
      value: deployedService.updatedAt
    }
  ]
}

export { transformDeploymentsToEntityRow }
