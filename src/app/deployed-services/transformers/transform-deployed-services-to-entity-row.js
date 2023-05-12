import { appConfig } from '~/src/config'
import { getDeploymentStatusClassname } from '~/src/app/deployed-services/helpers/get-deployment-status-classname'

function transformDeployedServicesToEntityRow(deployedService) {
  return [
    {
      kind: 'link',
      value: deployedService.serviceName,
      url: `${appConfig.get('appPathPrefix')}/deployed-services/${
        deployedService.id
      }`
    },
    {
      kind: 'tag',
      value: deployedService.targetEnvironment,
      classes: 'govuk-tag--blue'
    },
    {
      kind: 'text',
      value: deployedService.version
    },
    {
      kind: 'tag',
      value: deployedService.deploymentStatus,
      classes: getDeploymentStatusClassname(deployedService.deploymentStatus)
    },
    {
      kind: 'text',
      value: deployedService.triggeredByUserId
    },
    {
      kind: 'date',
      value: deployedService.timestamp
    }
  ]
}

export { transformDeployedServicesToEntityRow }
