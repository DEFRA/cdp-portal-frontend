import { getDeploymentStatusClassname } from '~/src/app/deployed-services/helpers/get-deployment-status-classname'

function transformDeployedServiceToHeadingEntities(deployedService) {
  return {
    primary: [
      {
        kind: 'tag',
        value: deployedService.targetEnvironment,
        classes: 'govuk-tag--blue',
        size: 'small'
      },
      {
        kind: 'tag',
        value: deployedService.deploymentStatus,
        classes: getDeploymentStatusClassname(deployedService.deploymentStatus),
        size: 'small'
      },
      {
        kind: 'text',
        value: deployedService.version,
        size: 'small',
        label: 'Version'
      }
    ],
    secondary: [
      {
        kind: 'text',
        value: deployedService.triggeredByUserId,
        size: 'small',
        label: 'Deployed by'
      },
      {
        kind: 'date',
        value: deployedService.timestamp,
        size: 'large',
        label: 'On'
      }
    ]
  }
}

export { transformDeployedServiceToHeadingEntities }
