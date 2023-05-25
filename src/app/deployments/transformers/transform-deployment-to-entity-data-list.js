import { getDeploymentStatusClassname } from '~/src/app/deployments/helpers/get-deployment-status-classname'

function transformDeploymentToEntityDataList(deployedService) {
  return [
    {
      heading: 'Status',
      entity: {
        kind: 'tag',
        value: deployedService.status,
        classes: getDeploymentStatusClassname(deployedService.status)
      }
    },
    {
      heading: 'Environment',
      entity: {
        kind: 'tag',
        value: deployedService.environment,
        classes: 'govuk-tag--blue'
      }
    },
    {
      heading: 'Version',
      entity: {
        kind: 'text',
        value: deployedService.version,
        size: 'small'
      }
    },
    {
      heading: 'Docker Image name',
      entity: {
        kind: 'text',
        value: deployedService.service
      }
    },
    {
      heading: 'Deployed by',
      entity: {
        kind: 'text',
        value: deployedService.user,
        size: 'small'
      }
    },
    {
      heading: 'Deployment date',
      entity: {
        kind: 'date',
        value: deployedService.deployedAt,
        size: 'large'
      }
    }
  ]
}

export { transformDeploymentToEntityDataList }
