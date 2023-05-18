import { getDeploymentStatusClassname } from '~/src/app/deployed-services/helpers/get-deployment-status-classname'

function transformDeployedServicesToEntityRow(deployedService) {
  return [
    {
      kind: 'text',
      value: deployedService.service
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

export { transformDeployedServicesToEntityRow }
