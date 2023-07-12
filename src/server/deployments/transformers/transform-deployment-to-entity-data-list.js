import { getDeploymentStatusClassname } from '~/src/server/deployments/helpers/get-deployment-status-classname'

function transformDeploymentToEntityDataList(deployedService) {
  // TODO remove once snd is removed or name is aligned
  const environment =
    deployedService.environment === 'snd'
      ? 'sandbox'
      : deployedService.environment

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
        value: environment,
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
      heading: 'Image name',
      entity: {
        kind: 'text',
        value: deployedService.service
      }
    },
    {
      heading: 'By',
      entity: {
        kind: 'text',
        value: deployedService.user,
        size: 'small'
      }
    },
    {
      heading: 'Updated',
      entity: {
        kind: 'date',
        value: deployedService.updatedAt,
        size: 'large'
      }
    }
  ]
}

export { transformDeploymentToEntityDataList }
