import { appConfig } from '~/src/config'
import { getDeploymentStatusClassname } from '~/src/app/deployments/helpers/get-deployment-status-classname'

function transformDeploymentsToEntityRow(deployedService) {
  return [
    {
      kind: 'link',
      value: deployedService.service,
      url: `${appConfig.get('appPathPrefix')}/deployments/${
        deployedService.deploymentId
      }`
    },
    {
      kind: 'tag',
      value: deployedService.environment,
      classes: 'govuk-tag--blue'
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
      value: deployedService.deployedAt
    }
  ]
}

export { transformDeploymentsToEntityRow }
