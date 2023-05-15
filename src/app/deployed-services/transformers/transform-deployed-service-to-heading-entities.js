import { getDeploymentStatusClassname } from '~/src/app/deployed-services/helpers/get-deployment-status-classname'

function transformDeployedServiceToHeadingEntities(deployedService) {
  return {
    primary: [
      {
        kind: 'tag',
        value: deployedService.environment,
        classes: 'govuk-tag--blue',
        size: 'small'
      },
      {
        kind: 'tag',
        value: deployedService.status,
        classes: getDeploymentStatusClassname(deployedService.status),
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
        value: deployedService.user,
        size: 'small',
        label: 'Deployed by'
      },
      {
        kind: 'date',
        value: deployedService.deployedAt,
        size: 'large',
        label: 'On'
      }
    ]
  }
}

export { transformDeployedServiceToHeadingEntities }
